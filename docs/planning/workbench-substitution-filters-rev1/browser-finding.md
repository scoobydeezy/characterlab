# Browser capture timing finding

The initial browser zero capture has empty state and no hashes; status is Working.
The first checker rejected it. The original browser.json and failed checker are
retained. Subsequent actions waited for enabled controls and produced complete
committed state. A separate fresh zero capture after run creation and enabled
checkpoint capture retains full state and five hashes; its status is Working on
checkpoint capture, which does not advance the simulation. The corrected checker
requires the initial empty observation, excludes it from parity claims, joins the
separate initialized zero and all other captures to original archived commitments,
and verifies baseline identity against these committed zero/one states.
