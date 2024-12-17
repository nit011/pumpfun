import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaPumpFun } from "../../target/types/solana_pump_fun";

const program = anchor.workspace.SolanaPumpFun as Program<SolanaPumpFun>;

const seedStrings = {
    platformSeedString: "platform",
    mintSeedString: "mint",
    tokenInfoSeedString: "token",
    tokenAccountSeedString: "token_account",
    metadataSeedString: "metadata",
};

const tokenDetails = {
    name: "Token",
    symbol: "T",
    uri: "www.example.com",
};

const metadataTokenProgramPubkey = new anchor.web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

const platformKeypair = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(seedStrings.platformSeedString)],
    program.programId
)[0];
const mintKeypair = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(seedStrings.mintSeedString), Buffer.from(tokenDetails.name)],
    program.programId
)[0];
const metadataKeypair = anchor.web3.PublicKey.findProgramAddressSync(
    [
        Buffer.from(seedStrings.metadataSeedString),
        metadataTokenProgramPubkey.toBuffer(),
        mintKeypair.toBuffer(),
    ],
    metadataTokenProgramPubkey
)[0];
const tokenInfoKeypair = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(seedStrings.tokenInfoSeedString), Buffer.from(tokenDetails.name)],
    program.programId
)[0];
const escrowTokenAccountKeypair = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(seedStrings.tokenAccountSeedString), mintKeypair.toBuffer()],
    program.programId
)[0];

const keypairs = {
    platformKeypair,
    mintKeypair,
    metadataKeypair,
    tokenInfoKeypair,
    escrowTokenAccountKeypair,
};

export { program, tokenDetails, seedStrings, keypairs };
