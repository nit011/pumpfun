import * as anchor from "@coral-xyz/anchor";
import { assert } from "chai";
import { program, keypairs } from "./utils/constants";

describe("Solana pump fun", () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const owner = (provider.wallet as anchor.Wallet).payer;
    const feeInBps = new anchor.BN(100); // 1%
    const totalSupply = new anchor.BN(100e9);
    const virtualSol = new anchor.BN(100e9);
    const targetPoolBalance = new anchor.BN(150e9);

    it("Is initialized!", async () => {
        const platformParams = {
            owner: owner.publicKey,
            feeInBps,
            totalSupply,
            virtualSol,
            targetPoolBalance,
        };

        await program.methods.initialize(platformParams).accounts({}).signers([owner]).rpc();

        const account = await program.account.platform.fetch(keypairs.platformKeypair.toBase58());

        assert.equal(account.owner.toString(), owner.publicKey.toString());
        assert.equal(account.feeInBps.toNumber(), feeInBps.toNumber());
        assert.equal(account.totalSupply.toNumber(), totalSupply.toNumber());
        assert.equal(account.virtualSol.toNumber(), virtualSol.toNumber());
        assert.equal(account.targetPoolBalance.toNumber(), targetPoolBalance.toNumber());
        assert.equal(account.accumulatedFees.toNumber(), 0);
    });

    it("Can change fees", async () => {
        const newFeesInBps = new anchor.BN(200); // 2%

        await program.methods.changeFees(newFeesInBps).accounts({}).signers([owner]).rpc();

        const account = await program.account.platform.fetch(keypairs.platformKeypair.toBase58());

        assert.equal(account.feeInBps.toNumber(), newFeesInBps.toNumber());
    });

    it("Can change total supply", async () => {
        const newTotalSupply = new anchor.BN(200e9); // 2%

        await program.methods.changeTotalSupply(newTotalSupply).accounts({}).signers([owner]).rpc();

        const account = await program.account.platform.fetch(keypairs.platformKeypair.toBase58());

        assert.equal(account.totalSupply.toNumber(), newTotalSupply.toNumber());
    });

    it("Can change virtual sol amount", async () => {
        const newVirtualSol = new anchor.BN(200e9); // 2%

        await program.methods
            .changeVirtualSolAmount(newVirtualSol)
            .accounts({})
            .signers([owner])
            .rpc();

        const account = await program.account.platform.fetch(keypairs.platformKeypair.toBase58());

        assert.equal(account.virtualSol.toNumber(), newVirtualSol.toNumber());
    });

    it("Can change target pool balance", async () => {
        const newTargetPoolBalance = new anchor.BN(200e9); // 2%

        await program.methods
            .changeTargetPoolBalance(newTargetPoolBalance)
            .accounts({})
            .signers([owner])
            .rpc();

        const account = await program.account.platform.fetch(keypairs.platformKeypair.toBase58());

        assert.equal(account.targetPoolBalance.toNumber(), newTargetPoolBalance.toNumber());
    });

    it("Can change owner", async () => {
        const newOwner = anchor.web3.Keypair.generate();

        await program.methods.changeOwner(newOwner.publicKey).accounts({}).signers([owner]).rpc();

        const account = await program.account.platform.fetch(keypairs.platformKeypair.toBase58());

        assert.equal(account.owner.toString(), newOwner.publicKey.toString());
    });
});
