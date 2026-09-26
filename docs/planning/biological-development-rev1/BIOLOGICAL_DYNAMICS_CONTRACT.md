# Biological dynamics candidate — 2026-09-26

ACCEPTED LOCAL DISPOSITION, biological-dynamics/0.1-candidate. Implements existing
physiological/regulatory/adaptation boxes as a research component. No public scheduler
admission or permanent record allocation. The work order owns behavioral completion.

World state is an exact rational lattice (scale1000; ties to even on each complete
unit transition). A unit tick is a declared biological integration boundary; fractional
tick subdivision is not admitted. All simultaneous channel reads use the same prior
state. Queries never advance or reanchor. Transition bounds0..1000 except signed
network weights. All quantities are abstract normalized units, not clinical units.

Resources fuel/water, sleep debt, damage and intoxicant burden are distinct from
regulator levels reward/stress/arousal. Named analogs: reward=Dopamine;
stress=Cortisol-like; arousal=activation. Each regulator has constitutional baseline,
decay, response threshold/saturation, tolerance gain/recovery, sensitization gain/
recovery and displacement gain/recovery. Constitutions are immutable run parameters.
Each regulator owns exposure-specific tolerance/sensitization and variable-level
displacement, plus current activity and transient satiation. None is belief.

At each tick, current resources deplete; sleep debt rises awake or falls asleep;
damage recovers; intoxication clears. Explicit physical input adds resource/sleep/
injury/intoxicant effects. Current regulator activity decays toward its constitutional
baseline. Simultaneous network inputs use prior levels relative to baselines.
External stimulus has signed effect direction and nonnegative magnitude. Its effect
is attenuated by tolerance and satiation, amplified by sensitization, thresholded
and bounded. Exposure updates adaptation only after current effects. Absence relaxes
adaptation under explicit rates; it is not character learning. An acquired regulatory
target is baseline plus displacement; deficient activity yields withdrawal pressure.

The first kernel must publish each term and its before/after state separately.
Current saturation, lower response to same stimulus and raised target cannot alias.
Sleep/circadian phase, bodily damage and intoxication supply separately inspectable
physical control/execution challenge operands; no direct character intent mutation.
Core comparisons: Full, NoTolerance, NoDisplacement, NoSensitization, NoRecovery,
IndependentAxes. These are interventions, not selected universal laws.

Sensing returns quantized admitted resource deficits, sleepiness, pain, intoxication,
regulatory activity and withdrawal discomfort. Missing/denied is null, never zero.
No constitutional coefficient, adaptation state, input provenance or hidden overflow
crosses the sensor. Observation resolution is committed independently of body values.
Experienced positive reward derives from admitted reward activity above its neutral
point; relief derives from an observed decrease in discomfort. Neither is a hidden
effect value or a replacement for the general prediction-discrepancy learning seam.

Exact equations (all products/divisions use rational arithmetic then ties-to-even
rounding to integer lattice; clamp means0..1000): resource'=clamp(resource-drain+input);
sleep'=clamp(sleep+(asleep?-sleepRecovery:sleepAccumulation));
damage'=clamp(damage-healing+injury); burden'=clamp(burden-clearance+intoxicant).
For each channel, decay term=round((baseline-level)*decay/1000), network term is
sum(round((otherLevel-otherBaseline)*weight/1000)). For each stimulus of exposure e,
potential=round(dose*(1000+sensitization[e])/(1000+tolerance[e])
*(1000-satiation)/1000); effective=max(0,potential-threshold). Sum signed effective
terms with decayed level and network input, then clamp once for next activity.
Tolerance/sensitization[e] gain round(dose*gain/1000) on exposure; otherwise lose
their respective recovery amounts. Displacement gains round(totalDose*gain/1000)
on exposure, otherwise loses recovery. Satiation'=clamp(satiation-satiationRecovery
+round(totalDose*satiationGain/1000)). All adaptation reads are prior-state reads.
Withdrawal=max(0,clamp(baseline+displacement)-level), a derived physical gap.
Known sensor values are floor(value/resolution)*resolution; resolution is a positive
divisor of1000. Each channel can be denied independently. Circadian phase advances
modulo24; sleepiness is clamp(debt+nightDrive) at phases0..5, debt otherwise.
Physical control challenge=clamp(sleepiness/2+stress/2+burden/2+abs(arousal-500)/2),
execution challenge=clamp(damage/2+burden/2); each division uses ties-to-even rounding.
These are separately observable research challenge operands, not intent commands.
Stress input is physical stimulus in this contract. No appraisal-to-body feedback
edge is implied by calling the channel Cortisol-like.

Candidate parameters are hypotheses. No learned habit,
identity, affect, goal, observer knowledge or public record is created by the world
transition alone. Full integration remains OPEN until the work-order witnesses pass.
