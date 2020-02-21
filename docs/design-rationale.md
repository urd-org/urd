# Design Rationale

## Principles

1. **Not turing complete.** Urd Protocol is not meant to manipulate the data that you fetch or want to post. Urd is merely meant to be a protocol that sits in the middle that sends bytes between chains that is indistinguishable to Urd (every byte looks the same to Urd). Urd bets that a computing platform will emerge, thus it will make more sense to do the data manipulation on there than on Urd.
1. **Time to first sync**. Urd optimizes for time to first sync. Given that a big part of Urd's goal is to become a gateway for other chains - time to first sync is important. On the basis of that, we have made design decisions such as account model over UTXO model, and Proof of Stake over Proof of Work. Account model is more simple for a light-client because it doesn't need coin-picking algorithms and it's single value. Proof of stake is chosen over Proof of Work due to instant finality and non-probabilistic behavior.
