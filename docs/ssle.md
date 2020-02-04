# Secret Single-Leader Election

## Construction

Let v_1, ..., v_k be a list of validators, each with a public-private key pair (pk_i, sk_i) and let h be the block height.

Given a verfiable delay function f(x) = y s.t. evaluation takes t time and verification is negligible, each validator commits an integer n before evaluation.

After commitment, f(prev_vdf_eval + n + h) = curr_vdf_eval is evaluated and used for selecting a leader through hashing.

The validator with the largest hash from H(curr_vdf_eval + pk + h) is the leader.

Notes: If block time bt is the same as the vdf time t, only one vdf will be evaluated at a time. If block time bt is e.g. t / 6, then 6 vdfs will be active at a single point in time for each validator.

## Attacks

The validators can evaluate their results ahead of time, and pick a pk and n that will give them high values in the future and go with that. But, when another validator evaluates a larger value than the attacker's, the whole chain created by the attacker becomes useless as the prev_vdf_evals becomes useless. Given long enough time and a large enough set of validators, pre-evaluations becomes useless.

## Drawbacks

The algorithm for choosing validator is not fair. It picks a validator randomly, i.e. not weighted against a power table.
