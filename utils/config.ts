import { neox, neoxTestnet } from "./chains/neoxChain";

export const ETH_CHAINS = [neoxTestnet, neox];
export const WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "";

export const SITE_NAME = "NeoFlex";
export const SITE_MOTTO = "Liquid Staking";
export const SITE_DESCRIPTION = "The optimized Liquid Staking protocol on NEOX";
export const SITE_URL = "https://neoflex.app";

export const SOCIAL_TWITTER = "Envoy_1084";
export const SOCIAL_GITHUB = "Envoy-VC/boilr3";

export const NFT_CONTRACT_ADDRESS =
  "0x0Fc5f8A784810dEd101BD734cC59F6F7b868A3AF";

export const ironOptions = {
  cookieName: SITE_NAME,
  password:
    process.env.SESSION_PASSWORD ??
    "set_a_complex_password_at_least_32_characters_long",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
