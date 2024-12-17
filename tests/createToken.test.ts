import * as anchor from "@coral-xyz/anchor";
import { assert } from "chai";
import { program, tokenDetails, keypairs } from "./utils/constants";

describe("Solana pump fun", () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const owner = (provider.wallet as anchor.Wallet).payer;
    const feeInBps = new anchor.BN(100); // 1%
    const totalSupply = new anchor.BN(100e9);
    const virtualSol = new anchor.BN(100e9);
    const targetPoolBalance = new anchor.BN(150e9);

    before(async () => {
        const platformParams = {
            owner: owner.publicKey,
            feeInBps,
            totalSupply,
            virtualSol,
            targetPoolBalance,
        };

        await program.methods.initialize(platformParams).accounts({}).signers([owner]).rpc();
    });

    it("Can create new token", async () => {
        await program.methods
            .createToken(tokenDetails)
            .accounts({
                metadata: keypairs.metadataKeypair.toBase58(),
            })
            .signers([owner])
            .rpc();

        const tokenInfo = await program.account.tokenInfo.fetch(
            keypairs.tokenInfoKeypair.toBase58()
        );

        assert.equal(tokenInfo.token.toString(), keypairs.mintKeypair.toString());
        assert.equal(tokenInfo.totalSupply.toNumber(), totalSupply.toNumber());
        assert.equal(tokenInfo.virtualSol.toNumber(), virtualSol.toNumber());
        assert.equal(tokenInfo.solReserve.toNumber(), virtualSol.toNumber());
        assert.equal(tokenInfo.tokenReserve.toNumber(), totalSupply.toNumber());
        assert.equal(tokenInfo.targetPoolBalance.toNumber(), targetPoolBalance.toNumber());
    });

    it("Cannot create the same token again", async () => {
        try {
            await program.methods
                .createToken(tokenDetails)
                .accounts({
                    metadata: keypairs.metadataKeypair.toBase58(),
                })
                .signers([owner])
                .rpc();
        } catch (err) {
            assert((err as Error).message);
        }
    });
});
