# Vivarium Mathematical Reference for CharacterLab

**Status:** Implementation-derived reference  
**Last verified:** 2026-08-31  
**Scope:** Deterministic formulas currently capable of affecting authoritative simulation state or a
player-visible derived result

## 1. Purpose and scope

This document gives CharacterLab a single mathematical description of Vivarium's implemented
deterministic model. It records:

- the formula actually executed;
- the behavioral or technical goal of that formula;
- the meaning and units of every factor and variable;
- fixed-point, rounding, clamping, and tie-breaking rules that are part of the result;
- the current production tuning used by the Minimum Playable Scenario (MPS).

The implementation is the evidence for what exists. Design documents explain intent, but proposed
mathematics not reached by production code is not presented here as current behavior. The authoritative
simulation is integral and Unity-independent. Unity may interpolate or format a result, but it does not
own any formula in this reference.

Included are arithmetic transformations that affect state, scheduling, selection, probability,
reasoning, or player-visible projections. Excluded are serialization copies, collection sizes, loop
counters, enum casts, and ordinary object hash codes used only by in-memory dictionaries. Stable hashes
that seed deterministic randomness are included because they can change outcomes.

Primary implementation sources:

- [`Common/IntegerMath.cs`](../Core/Runtime/Domain/Common/IntegerMath.cs)
- [`Common/StableHash.cs`](../Core/Runtime/Domain/Common/StableHash.cs)
- [`Randomness/DeterministicRandomOracle.cs`](../Core/Runtime/Domain/Randomness/DeterministicRandomOracle.cs)
- [`Time/AnalyticalProgression.cs`](../Core/Runtime/Domain/Time/AnalyticalProgression.cs)
- [`Evaluation/SignalField.cs`](../Core/Runtime/Domain/Evaluation/SignalField.cs)
- [`Social/SocialEvidence.cs`](../Core/Runtime/Domain/Social/SocialEvidence.cs)
- [`Decisions/DecisionReasoningProgram.cs`](../Core/Runtime/Domain/Decisions/DecisionReasoningProgram.cs)
- [`Decisions/DecisionResolutionService.cs`](../Core/Runtime/Domain/Decisions/DecisionResolutionService.cs)
- [`SampleContent.cs`](../DotNet/Vivarium.SimRunner/SampleContent.cs)

## 2. Global numeric conventions

### 2.1 Integral simulation units

Authoritative branching uses integers. The principal units are:

| Quantity | Stored unit | Normal range |
| --- | ---: | ---: |
| SimTime and SimDuration | whole simulation minutes | signed 64-bit integer |
| Normalized signal or score | fixed-point units | `-10,000..10,000` |
| Probability | basis points | `0..10,000` |
| Activity/travel progress | basis points | `0..10,000` |
| Signal variance/covariance | fixed-point units squared | normally `-100,000,000..100,000,000`; diagonal variance is nonnegative |
| Need, affect, relationship channel, familiarity | authored integral units | currently usually `0..10,000` or `-10,000..10,000` |

Let the shared fixed-point scale be

\[
S=10{,}000.
\]

A stored coordinate `x` represents the real value \(x/S\). A stored covariance \(\Sigma\) represents
real covariance \(\Sigma/S^2\).

### 2.2 Clamp

\[
\operatorname{clamp}(x,a,b)=\min(\max(x,a),b).
\]

Clamping is semantic, not cosmetic: once a Need, coordinate, score, balance, or progress value reaches
its declared bound, further movement beyond that bound does not change the exposed value.

### 2.3 Sign-correct integer division

For integer dividend \(a\) and nonzero divisor \(b\):

\[
\operatorname{floorDiv}(a,b)=\left\lfloor\frac{a}{b}\right\rfloor,
\qquad
\operatorname{ceilDiv}(a,b)=\left\lceil\frac{a}{b}\right\rceil.
\]

The helpers correct C#'s truncation toward zero when the mathematical result is negative. This keeps
analytical progress monotonic in both directions.

### 2.4 Fixed-point multiplication and rounding

Vivarium rounds fixed-point division to the nearest integer, with half values away from zero:

\[
\operatorname{roundDiv}(a,d)=
\begin{cases}
\left\lfloor\dfrac{a+d/2}{d}\right\rfloor,&a\ge0,\\
-\left\lfloor\dfrac{-a+d/2}{d}\right\rfloor,&a<0.
\end{cases}
\]

The common products are:

\[
\operatorname{mul}(a,b)=\operatorname{roundDiv}(ab,S),
\]

\[
\operatorname{mulCov}(c,\sigma)=\operatorname{roundDiv}(c\sigma,S^2).
\]

`BigInteger` intermediates are used where a matrix expression could overflow 64-bit multiplication;
the final value is clamped to the 64-bit range.

## 3. Simulation time and analytical progression

### 3.1 Calendar conversion

\[
M_h=60,\qquad H_d=24,\qquad M_d=M_hH_d=1440.
\]

For day \(d\), hour \(h\), and minute \(m\):

\[
t=dM_d+hM_h+m.
\]

Conversely, day, hour, and minute are derived by integer quotient and remainder from total minutes.
The goal is one authoritative clock independent of frame rate.

### 3.2 Linear analytical value

Every continuously changing authoritative quantity uses an anchor triple: anchor value \(v_0\), anchor
time \(t_0\), and rational rate \(n/d\) units per simulation minute. With lower and upper bounds
\(v_{\min},v_{\max}\):

\[
v(t)=\operatorname{clamp}\left(
v_0+\left\lfloor\frac{(t-t_0)n}{d}\right\rfloor,
v_{\min},v_{\max}
\right),\qquad d>0.
\]

| Variable | Meaning |
| --- | --- |
| \(v(t)\) | materialized value at SimTime \(t\) |
| \(v_0\) | value when last anchored |
| \(t_0\) | anchor time in minutes |
| \(n/d\) | exact rational rate per minute |
| \(v_{\min},v_{\max}\) | authored bounds |

Goal: replace per-character/per-frame ticking with exact on-demand evaluation. Needs, affect,
relationship channels, familiarity, Activity progress, and Activity performance all reuse this formula.

An instantaneous effect \(\Delta\), such as eating or relationship evidence, is applied as

\[
v'_0=\operatorname{clamp}(v(t)+\Delta,v_{\min},v_{\max}),\qquad t'_0=t.
\]

A rate change first materializes \(v(t)\), then creates a new anchor at \(t\). This makes a context
modifier count for exactly the interval in which it was active.

### 3.3 Progress over a fixed duration

To progress from \(a\) to \(b\) over duration \(D>0\):

\[
n=b-a,\qquad d=D.
\]

Activity progress currently uses \(a=0\), \(b=10{,}000\). A nonpositive duration becomes immediately
complete at \(b\).

### 3.4 Exact threshold-crossing time

Let \(\Delta=q-v_0\), where \(q\) is the watched threshold. For an increasing progression, the first
elapsed minute \(e\) that reaches the threshold is

\[
e=\left\lceil\frac{\Delta d}{n}\right\rceil,\qquad n>0.
\]

For a decreasing progression:

\[
e=\left\lfloor\frac{(\Delta+1)d}{n}\right\rfloor+1,\qquad n<0.
\]

The crossing time is

\[
t_q=t_0+\max(0,e).
\]

If the rate is zero, points in the wrong direction, or the threshold lies beyond the clamp, the
threshold is unreachable and no event is scheduled. Goal: schedule only behaviorally meaningful
crossings while remaining exact for negative rates.

### 3.5 Current MPS Need equations

All four production Needs are bounded to \([0,10{,}000]\):

| Need | Formula before clamping | Watched behavior |
| --- | --- | --- |
| Hunger | \(H(t)=H_0+12(t-t_0)\) | thresholds 6,000, 8,000, 9,500; Eating applies \(-5,000\) |
| Social | \(So(t)=So_0+4(t-t_0)\) | activates at 7,000; Socializing applies \(-5,000\) |
| Recreation | \(R(t)=R_0+2(t-t_0)\) | activates at 6,000; recreation applies \(-5,000\) |
| Energy | \(E(t)=E_0-10(t-t_0)\) | Rest at 2,000; continue thresholds step 2,000 → 1,000 → 0 |

During Sleep, Energy recovery uses \(+20\) per minute until the recovered threshold 8,000. These are
content parameters passed through the common analytical formula rather than separate Need algorithms.

## 4. Travel, Activity, and schedule mathematics

### 4.1 Route cost

For route \(P\) containing ordered legs \(e_1,\ldots,e_k\):

\[
C(P)=\sum_{i=1}^{k}c(e_i).
\]

Dijkstra relaxation is

\[
C_{candidate}(v)=C(u)+c(u,v).
\]

The lower total cost wins; equal-cost frontier entries break by LocationId, and adjacency ties break by
destination then travel-mode id. Goal: shortest integral travel time with stable replay behavior.

Current MPS bidirectional costs are Home↔Bakery 12 minutes, Home↔Commons 5 minutes, and
Commons↔Bakery 9 minutes.

### 4.2 Travel progress

For departure \(t_d\), arrival \(t_a\), and query time \(t\):

\[
p(t)=\operatorname{clamp}\left(
\left\lfloor\frac{(t-t_d)10{,}000}{t_a-t_d}\right\rfloor,
0,10{,}000
\right).
\]

If \(t_a-t_d\le0\), progress is 10,000. This is a player-visible derived value; it never moves the
character or branches the simulation.

### 4.3 Activity performance under context changes

Performance is another analytical progression. For consecutive intervals \(j\), each with duration
\(\Delta t_j\) and rational rate \(n_j/d_j\):

\[
P(t)=P_0+\sum_j\left\lfloor\frac{\Delta t_j n_j}{d_j}\right\rfloor.
\]

At every context boundary the old interval is materialized and the new rate is anchored. In the MPS,
a disliked colleague is relevant when directional Affection is at most \(-1{,}000\); while relevant,
Working performance changes at \(-2\) units/minute. Removing the modifier restores the rate snapshotted
when the Activity began.

### 4.4 Recurring commitment day

For absolute day \(d\) and cycle length \(L\):

\[
d_c=((d\bmod L)+L)\bmod L.
\]

The occurrence is active exactly when bit \(d_c\) of the authored day mask is 1:

\[
(mask\;\&\;(1\ll d_c))\ne0.
\]

The double modulo handles negative days. The first occurrence scan is bounded to one complete cycle.

### 4.5 Commitment windows and overlap

For commitment \(i\):

\[
end_i=earliestStart_i+duration_i.
\]

Two commitments overlap when their half-open execution intervals overlap:

\[
earliestStart_a<end_b\quad\land\quad earliestStart_b<end_a.
\]

A planned departure is

\[
departAt=\max(now,earliestStart-travelDuration).
\]

Window expiration is scheduled one minute after `LatestStart`, preserving an inclusive latest-start
boundary.

### 4.6 Joint commitment feasibility

For a candidate ordering of commitments, with current availability \(a\) and location \(\ell\):

\[
arrival_i=a+travel(\ell,location_i),
\]

\[
start_i=\max(arrival_i,earliestStart_i).
\]

The step is feasible if \(start_i\le latestStart_i\), after which

\[
a'=start_i+duration_i,\qquad \ell'=location_i.
\]

The bounded search evaluates complete deterministic orderings. The set is jointly feasible if any
ordering reaches every commitment. The latest safe time to resolve the conflict from origin \(o\) is

\[
deadline=\max\left(now,\min_i(latestStart_i-travel(o,location_i))\right).
\]

Goal: detect travel-induced infeasibility that pairwise time-overlap checks cannot see.

## 5. Stable hashing and deterministic randomness

### 5.1 FNV-1a authored-string hash

Starting with offset basis \(h_0=14695981039346656037\), each UTF-16 code unit is processed as its low
byte then high byte. For each byte \(b\):

\[
h'=(h\oplus b)\times1099511628211\pmod{2^{64}}.
\]

Goal: a culture-, framework-, and process-independent authored-id hash.

### 5.2 Hash combination and SplitMix64 avalanche

With golden increment \(\gamma=\mathtt{0x9E3779B97F4A7C15}\):

\[
c=a\oplus(v+\gamma+(a\ll6)+(a\gg2)),
\]

followed by:

\[
x_1=(c\oplus(c\gg30))\times\mathtt{BF58476D1CE4E5B9},
\]
\[
x_2=(x_1\oplus(x_1\gg27))\times\mathtt{94D049BB133111EB},
\]
\[
h=x_2\oplus(x_2\gg31),
\]

all modulo \(2^{64}\).

The raw oracle value is the ordered combination

\[
R=H(worldSeed,scopeType,scopeId,purpose,rollIndex).
\]

Each component gives randomness semantic identity. Unrelated draws therefore do not shift one another's
streams.

### 5.3 Unbiased bounded integer

For span \(m>1\):

\[
L=(2^{64}-1)-((2^{64}-1)\bmod m).
\]

While \(R\ge L\), remap \(R\leftarrow avalanche(R+\gamma)\). Then

\[
U=R\bmod m.
\]

This rejection removes modulo bias. Consequently:

\[
range(min,max)=min+U,\quad m=max-min,
\]

\[
die(d)=1+U,\quad m=d.
\]

A basis-point chance succeeds when

\[
U_{10{,}000}<p.
\]

Values \(p\le0\) always fail and \(p\ge10{,}000\) always succeed.

### 5.4 Knowledge discovery probability

For channel difficulty \(D\) in basis points:

\[
p_{learn}=\operatorname{clamp}(10{,}000-D,0,10{,}000).
\]

Difficulty at or below zero learns automatically; otherwise the deterministic chance test above is
used. Goal: observations create reproducible opportunities to learn without making truth equal
Knowledge.

### 5.5 Generated social profiles

Each provisional personality coordinate is sampled uniformly from the integers
\([-10{,}000,10{,}000]\). Each appraisal linear coefficient is

\[
w_i=\operatorname{clamp}(prior_{lens,i}+U_i,-10{,}000,10{,}000),
\]

where \(U_i\) is uniform on integers \([-2{,}500,2{,}500]\). Current nonzero priors are:

| Lens | Dimension priors |
| --- | --- |
| Affiliation | Warmth 5,000; Sociability 2,500; Attunement 3,500 |
| Respect | Discipline 5,000; Stability 4,000; Agency 3,000 |
| Comfort | Warmth 4,000; Attunement 5,500; Stability 2,500 |
| Reliance | Discipline 6,000; Stability 4,000 |

Every generated field also has an Agency×Attunement coefficient of 3,500 for Comfort and 1,000 for
other lenses, plus a one-dimensional ideal factor coefficient 2,000 around the observer's own
personality coordinate selected for that lens.

### 5.6 Bounded interaction-candidate sampling

Already-known characters are ranked first by descending social relevance and then CharacterId.
Remaining stranger slots are selected as distinct ordinals from the sorted stranger pool. For \(k\)
remaining slots, the bounded rejection budget is

\[
A=8k+16.
\]

Attempt \(a\) uses the random roll index

\[
j'=jA+a,
\]

where \(j\) is the opportunity roll index. For an arrival opportunity,

\[
j=(397\times characterId)\oplus totalSimMinutes.
\]

For a travel-segment scope,

\[
scopeId=(397\times fromLocationId)\oplus toLocationId.
\]

Selected ordinals are sorted before they are mapped back to CharacterIds. Goal: sample a hard-bounded
number of strangers without shuffling or scanning an unbounded population, while keeping the sample
stable for the same actor, context, and SimTime.

## 6. Deterministic uncertain signal fields

This is the principal CharacterLab research primitive. The same evaluator powers compiled Decision
Considerations and Social Appraisal.

### 6.1 Inputs

Let the uncertain signal vector be

\[
z\sim(\mu,\Sigma),
\]

where \(\mu\) is the vector of fixed-point means and \(\Sigma\) is the covariance matrix. The evaluator
does not sample this distribution; it propagates moments analytically.

The authored field contains:

| Symbol | Meaning |
| --- | --- |
| \(b\) | bias/baseline |
| \(w\) | sparse linear coefficient vector |
| \(Q\) | sparse symmetric pairwise interaction matrix |
| \(i\) | optional ideal point |
| \(L\) | sparse ideal/tolerance factors |
| \(P=LL^T\) | positive-semidefinite ideal penalty matrix |

Off-diagonal authored pair terms represent the complete \(z_i z_j\) contribution once; authors do not
mirror them.

### 6.2 Point latent score

In conceptual real-valued notation:

\[
s(z)=b+w^Tz+z^TQz-\frac12(z-i)^TP(z-i).
\]

The fixed-point implementation evaluates the equivalent sparse terms using `mul` and `mulCov`.

For each ideal factor row \(l_f\):

\[
m_f=l_f^T(\mu-i),
\]

\[
penalty_{point,f}=-\frac12m_f^2.
\]

The point latent score substitutes \(z=\mu\).

### 6.3 Expected latent score under uncertainty

For pairwise term \(q_{ij}\), uncertainty adds

\[
q_{ij}\Sigma_{ij}.
\]

For ideal factor \(l_f\), projected variance is

\[
v_f=l_f^T\Sigma l_f,
\]

so its expected penalty is

\[
penalty_{expected,f}=-\frac12(m_f^2+v_f).
\]

The complete expected pre-bounded score is

\[
E[s]=b+w^T\mu+\mu^TQ\mu+\operatorname{tr}(Q\Sigma)
-\frac12\left((\mu-i)^TP(\mu-i)+\operatorname{tr}(P\Sigma)\right).
\]

Goal: uncertainty and covariance may change an appraisal or reason without stochastic sampling.

### 6.4 Latent-score variance

Define

\[
A=Q-\frac12P,\qquad r=w+Pi.
\]

Then the implemented Gaussian quadratic-form variance is

\[
Var[s]=2\operatorname{tr}(A\Sigma A\Sigma)
+(r+2A\mu)^T\Sigma(r+2A\mu).
\]

The code uses \(B=2A=2Q-P\) to avoid representing halves during fixed-point matrix arithmetic. Any
negative result caused by rounding is clamped to zero.

### 6.5 Bounded response

The deterministic response function is the rational softsign:

\[
g(x)=\frac{x}{1+|x|}.
\]

In stored fixed-point units:

\[
g_S(x)=\operatorname{clamp}\left(
\operatorname{round}\left(\frac{xS}{S+|x|}\right),-S,S
\right).
\]

The evaluator reports

\[
\widehat{E[U]}=g(E[s]).
\]

This is explicitly a plug-in approximation, not a claim that \(E[g(s)]=g(E[s])\).

The derivative is

\[
g'(x)=\frac{1}{(1+|x|)^2},
\]

represented in stored units as

\[
g'_S(x)=\operatorname{round}\left(\frac{S^3}{(S+|x|)^2}\right).
\]

The first-order output variance approximation is

\[
Var[U]\approx g'(E[s])^2Var[s].
\]

Goal: compress unbounded latent pressure into a comparable \([-1,1]\) result while retaining a useful
uncertainty estimate and avoiding platform-sensitive floating-point transcendental functions.

## 7. Trait projection and Social Appraisal

### 7.1 Named trait projection

For personality point \(x\):

\[
trait(x)=g\left(b+\sum_iw_ix_i+\sum_{i\le j}q_{ij}x_ix_j\right).
\]

For a belief distribution, every pairwise product uses

\[
E[x_ix_j]=\mu_i\mu_j+\Sigma_{ij}.
\]

Goal: named traits are explainable projections of the latent space, not independent duplicate state.

### 7.2 Context-conditioned Social Appraisal

Active context modifiers add sparse deltas:

\[
b'=b+\sum_c\Delta b_c,\quad
w'=w+\sum_c\Delta w_c,\quad
Q'=Q+\sum_c\Delta Q_c,\quad
i'=i+\sum_c\Delta i_c,\quad
L'=L+\sum_c\Delta L_c.
\]

The merged field is then evaluated by Section 6. Context changes the present evaluation; it does not
rewrite personality or belief.

### 7.3 Additional social pressures

Personality appraisal can be combined with directional history, familiarity, shared tags, affect, and
independent context pressure:

\[
s_{combined}=E[s_{personality}]+\sum_k c_kx_k,
\]

\[
appraisal=g(s_{combined}).
\]

The current composite result carries forward the personality field's latent and output variance; it
does not recompute variance or the response derivative after adding these deterministic pressure terms.
That is an implementation detail CharacterLab should preserve when reproducing current behavior, and a
candidate research seam if the composite uncertainty model is later revised.

For a shared Interest or Value with signed intensities \(a\) and \(b\):

\[
shared(a,b)=
\begin{cases}
-\min(|a|,|b|),&\operatorname{sign}(a)\ne\operatorname{sign}(b),\\
\min(|a|,|b|),&\text{otherwise}.
\end{cases}
\]

Goal: agreement is limited by the weaker participant, while opposed signs become negative pressure.

### 7.4 Calibration bands

Calibration uses the absolute normalized appraisal. The highest threshold not exceeding the magnitude
wins. Current MPS bands are:

| \(|appraisal|\) minimum | Strength |
| ---: | --- |
| 1,000 | Minor |
| 2,500 | Moderate |
| 5,000 | Strong |
| 7,500 | Extreme |

Below 1,000 is Negligible. Sign remains separate from magnitude.

### 7.5 Directional relationship updates

For relationship channel \(c\):

\[
c'=\operatorname{clamp}(c(t)+\Delta c,-10{,}000,10{,}000).
\]

Familiarity uses the same analytical progression with bounds \([0,10{,}000]\):

\[
f'=\operatorname{clamp}(f(t)+\Delta f,0,10{,}000).
\]

Accumulated exposure minutes are

\[
X'=\max(0,X+\Delta X).
\]

An ordinary interaction currently applies \(+100\) Affection and \(+250\) Familiarity to both
directions and adds one exposure minute. Commitment accountability applies its authored directional
deltas independently; the current breach set is TrustJudgment \(-1{,}200\), Resentment \(+900\).

## 8. Social evidence and belief revision

Vivarium uses deterministic scalar Kalman updates over a joint latent vector.

### 8.1 Measurement model

For one measurement:

\[
y=h^Tx+\epsilon,\qquad Var(\epsilon)=R.
\]

| Variable | Meaning |
| --- | --- |
| \(x\) | target's latent social vector |
| \(\mu,P\) | observer's current belief mean and covariance |
| \(h\) | authored linear measurement projection |
| \(y\) | authored observed value |
| \(R\) | authored observation-noise variance |

The broad prior is \(\mu=0\), with diagonal \(P_{ii}=S^2=100{,}000{,}000\) and off-diagonal zero.

### 8.2 Innovation and gain

\[
\hat y=h^T\mu,
\]

\[
c=Ph,
\]

\[
V=R+h^TPh=R+h^Tc,
\]

\[
e=y-\hat y,
\]

\[
K=\frac{c}{V}.
\]

### 8.3 Posterior update

\[
\mu'=\mu+Ke,
\]

\[
P'=P-K(h^TP)=P-Kc^T.
\]

All steps use the fixed-point rules in Section 2 and captured pre-update covariance. Coordinate means
are clamped to \([-S,S]\); diagonal variance to \([0,S^2]\); off-diagonal covariance to
\([-S^2,S^2]\).

Goal: witnessed action changes what an observer believes about a target, with uncertainty reduction and
cross-dimension effects, without changing the target's true personality.

### 8.4 Contradiction inflation

A measurement is surprising when its squared innovation exceeds four innovation variances:

\[
e^2>4V.
\]

This corresponds to a residual beyond two innovation standard deviations. Then

\[
I_{base}=\min\left(\frac{S^2}{4},\frac{e^2-4V}{8}\right),
\]

and each measured diagonal receives

\[
P'_{ii}\leftarrow P'_{ii}+I_{base}|h_i|.
\]

The product is fixed-point scaled and the diagonal is clamped. Goal: a major contradiction is evidence
that an overconfident belief model was wrong, so uncertainty may increase rather than always collapse.

### 8.5 Current MPS evidence measurements

| Evidence | Projection \(h\) | \(y\) | \(R\) |
| --- | --- | ---: | ---: |
| Friendly interaction | 0.7 Warmth + 0.3 Sociability | 4,000 | 30,000,000 |
| Commitment fulfilled | 0.7 Discipline + 0.3 Stability | 4,500 | 30,000,000 |
| Commitment breached | 0.7 Discipline + 0.3 Stability | -6,000 | 30,000,000 |

Coefficients are shown as real proportions for readability; stored values are 7,000 and 3,000.

## 9. Decision reasoning

### 9.1 Signal normalization

An increasing Need with definition range \([m,M]\) becomes a normalized Decision signal:

\[
n=\operatorname{clamp}\left(
\operatorname{round}\left(\frac{(value-m)S}{M-m}\right),0,S
\right).
\]

Other implemented signal conversions include:

\[
prioritySignal=\operatorname{clamp}(100\times priority,0,S),
\]

\[
urgencySignal=\operatorname{clamp}(S-100\times\max(0,earliestStart-now),0,S),
\]

\[
travelBurden=\operatorname{clamp}(500\times travelMinutes,0,S).
\]

An unreachable route has maximal burden \(S\). Boolean or identity predicates generally use \(+S\)
for true and \(-S\) for false; availability uses \(+S\) when present and 0 when absent in its current
provider. Values, Interests, relationship channels, social appraisal, and Activity modifiers enter in
their existing normalized units.

### 9.2 Consideration field and option score

Each compiled Consideration evaluates a field using Section 6. Its signed bounded result \(r\) is an
option-relative reason:

\[
optionScore_o=\operatorname{clamp}\left(\sum_{j\in o}r_j,-S,S\right).
\]

Positive \(r\) supports the option; negative \(r\) opposes it.

### 9.3 Reason consolidation

By default, candidates sharing Option, semantic ReasonChannel, and subject do not stack. The retained
candidate is

\[
\arg\max_c |r_c|.
\]

An exact magnitude tie breaks by stable ConsiderationId. Channels explicitly marked `AllowStacking`
also include ConsiderationId in their identity. Goal: correlated readings do not silently become
multiple dice.

### 9.4 Score-to-die scales

The standard scale uses absolute bounded score:

| Minimum \(|r|\) | Die |
| ---: | ---: |
| 1,000 | d4 |
| 2,500 | d6 |
| 4,500 | d8 |
| 6,500 | d10 |
| 8,500 | d12 |

Special current scales are:

- commitment honorability: d4 at 0, d6 at 2,000, d8 at 4,000, d10 at 6,000;
- leave-work Hunger: d20 at 0;
- leave-work Work Context: d6 at 0 and d10 at 4,000;
- leave-work Reliability: d6 at 0.

The legacy Social Appraisal path maps Minor→d4, Moderate→d6, Strong→d8, Extreme→d10.

### 9.5 Derived Decision Importance

\[
Importance=\min\left(S,\max_j|r_j|\right)
\]

over all active consolidated reasons. Goal: one strong reason can make a Decision important; many
trivial reasons cannot inflate it by accumulation. Current MPS admission and prioritized-feed floor is
6,500; normal-feed and auto-hold floor is 7,000.

### 9.6 Current MPS Consideration fields

Every result below is subsequently passed through softsign \(g\). Signals are in fixed-point units.

| Decision field | Pre-bounded latent formula |
| --- | --- |
| Commitment honorability | \(s=p(0.6Priority+0.4Urgency-0.4TravelBurden)\), with \(p=+1\) for preserved and \(-1\) for relinquished |
| Leave work: Hunger | \(s=Urgency\) |
| Leave work: bad context | \(s=2.4\,WorkPressure\) |
| Leave work: Reliability | \(s=0.1\) |
| Recreation interest | \(s=3.0\,Interest\) |
| Rest: fatigue | \(s=0.8-0.8\,Energy\) |
| Continue: interest | \(s=2.4\,Interest\) |
| Continue: current Activity | \(s=0.2\,StillActive\) |
| Social invitation: comfort | \(s=1.0\,AffiliationAppraisal\) |
| Social invitation: shared context | \(s=0.8\,SharedContext\) |
| Social invitation: existing plan | \(s=1.2\,PlanInterest\) |

Decimal coefficients are the real-value reading of stored coefficients divided by \(S\). The actual
evaluation remains integer fixed-point. Commitment Priority and Urgency in the table are already
normalized by Section 9.1.

### 9.7 Finite continuation threshold

After choosing Continue, the next watched Energy threshold is

\[
q'=q-step.
\]

Current step is 1,000, yielding 2,000→1,000→0. A value below the Need minimum is not rearmed; the finite
sequence therefore terminates in Rest rather than creating an endless loop.

## 10. Decision dice and interventions

### 10.1 Influence roll

Each live influence rolls independently in the deterministic stream identified by DecisionId,
OptionId, label, InfluenceId, and RollIndex:

\[
r_i\sim UniformInteger(1,d_i).
\]

An authored fixed die instead returns its fixed face. The current replacement die is a loaded d20 with
\(r=20\).

Re-roll increments only the selected influence's RollIndex and evaluates the same semantic stream at
the next index.

### 10.2 Option totals and winner

For option \(o\):

\[
T_o=\sum_{i\in supporting(o)}r_i-\sum_{i\in opposing(o)}r_i.
\]

The highest total wins. Exact ties break by authored option order.

Let \(T_1\) and \(T_2\) be the winning and runner-up totals:

\[
margin=T_1-T_2.
\]

With only one option, `margin` is its own total. Degree of success is:

| Margin | Degree |
| ---: | --- |
| \(\ge8\) | Decisive |
| \(\ge4\) | Clear |
| \(\ge2\) | Marginal |
| otherwise | Reluctant |

Goal: Influences alter odds but neither the player nor iteration order directly chooses the winner.

### 10.3 Die stepping

The sanctioned ladder is

\[
[d2,d4,d6,d8,d10,d12,d20].
\]

Step Up selects the first larger die; Step Down selects the first smaller die when scanning downward.
At either end, the die remains unchanged.

## 11. Resource and boundary formulas

### 11.1 Capped balance

For balance \(B\), cap \(C\), spend \(s\), and refund/refresh \(a\):

\[
B_{spend}=B-s\quad\text{only if }0\le s\le B,
\]

\[
B_{increase}=\min(C,B+a),\qquad a\ge0.
\]

The MPS Nudge account starts at and is capped at 3. Successful Nudge-backed interventions cost their
snapshotted authored amount; current MPS Nudge interventions cost 1.

### 11.2 Aligned Nudge regeneration

With period \(P=8\times60=480\) minutes, the next strictly later boundary is

\[
t_{next}=\left(\left\lfloor\frac{t}{P}\right\rfloor+1\right)P.
\]

One Nudge regenerates at each boundary, capped at 3.

### 11.3 Other intervention-resource refresh

For authored refresh period \(P\), the next refresh advances by whole periods until strictly after the
current time:

\[
t'_{next}=t_{next}+kP,\qquad k=\min\{n\ge1:t_{next}+nP>now\}.
\]

Balance increases once by the authored refresh amount for the handled event and remains capped. The
current Re-roll resource is 1/1 and refreshes by 1 every day; the loaded-d20 holding is 1/1 and does not
refresh.

### 11.4 Offline conversion

Let wall-clock ticks be 100 ns and \(T_m=600{,}000{,}000\) ticks/minute. For current ticks \(w\), saved
anchor \(w_0\), simulation ratio \(r\), and maximum catch-up \(C\):

\[
realMinutes=\left\lfloor\frac{w-w_0}{T_m}\right\rfloor,
\]

\[
simMinutes=\min(C,realMinutes\times r).
\]

If \(w-w_0\le0\), the result is zero. Defaults are \(r=1\) and \(C=7\times24\times60=10{,}080\)
minutes. Goal: turn nondeterministic wall time into one explicit, bounded simulation input.

## 12. Player-visible derived formulas

These do not create world truth but are deterministic projections of it.

### 12.1 Activity timeline progress

For elapsed minutes \(e\) and total minutes \(D\):

\[
p=\operatorname{clamp}\left(\left\lfloor\frac{10{,}000e}{D}\right\rfloor,0,10{,}000\right),
\]

or 10,000 when \(D\le0\). The profile renders travel percent as \(\lfloor p/100\rfloor\).

### 12.2 Held-capacity availability

\[
globalAvailable=\max(0,globalCap-globalHeld),
\]

\[
characterAvailable=\max(0,perCharacterCap-heldForCharacter).
\]

### 12.3 Clock and duration labels

Displayed day/hour/minute are integer quotient/remainder decompositions of total simulation minutes.
Simulation speed shown as `x` is `speedPercent / 100`; this is formatting only.

## 13. Formula dependency map

```text
Stable hash + semantic scope
        ↓
deterministic bounded draws ──→ knowledge discovery, profile generation, dice, candidate sampling

integer/fixed-point arithmetic
        ├──→ analytical progression ──→ Needs, Activities, relationships, scheduling
        ├──→ uncertain signal field ──→ Social Appraisal ──→ social pressure
        │                           └──→ Decision Considerations
        └──→ scalar Kalman update ──→ observer belief ──→ Social Appraisal

Decision Considerations ──→ consolidated reasons ──→ dice ──→ option totals and margin
```

## 14. Interpretation cautions for CharacterLab

1. **Stored units are not floating-point values.** A coefficient shown as 0.7 is stored as 7,000 and
   evaluated with deterministic rounding.
2. **The bounded estimate is an approximation.** Vivarium computes \(g(E[s])\), not the generally
   unequal \(E[g(s)]\).
3. **Uncertainty is causal.** Covariance changes expected pairwise and ideal-point contributions; it is
   not merely presentation metadata.
4. **Belief is directional and observer-relative.** An appraisal evaluates an observer's belief about a
   target, not the target's true latent vector.
5. **Sign and strength are separate.** Calibration and die mapping use absolute magnitude; option
   polarity carries direction.
6. **Authored constants are research hypotheses, not universal psychological claims.** The evaluator is
   generic; MPS coefficients are current gameplay tuning suitable for experiments and falsification.
7. **Rounding, clamps, and tie-breaks are part of each formula.** Omitting them can produce a model that
   looks equivalent on paper but diverges during replay or near thresholds.

## 15. Verification boundary

This reference was derived from production source in `Core/Runtime`, the shared MPS world builder, the
headless `SampleContent` catalog, and their tests. It intentionally does not elevate formulas found only
inside test fixtures into production behavior. When implementation changes, update this document in the
same change if a formula, coefficient, rounding rule, bound, threshold, or tie-break described here is
affected.
