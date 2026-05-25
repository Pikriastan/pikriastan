import type { NextConfig } from "next";

function readImageHosts(): { protocol: "https" | "http"; hostname: string }[] {
	const hosts = new Set<string>();
	const tryAdd = (url: string | undefined) => {
		if (!url) return;
		try {
			const u = new URL(url);
			hosts.add(u.hostname);
		} catch {
			// ignore malformed urls
		}
	};
	tryAdd(process.env.R2_PUBLIC_BASE_URL);
	tryAdd(process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL);
	if (process.env.R2_ACCOUNT_ID) {
		hosts.add(`${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`);
	}
	hosts.add("**.r2.dev");
	hosts.add("**.r2.cloudflarestorage.com");
	return Array.from(hosts).map((hostname) => ({
		protocol: "https" as const,
		hostname,
	}));
}

const nextConfig: NextConfig = {
	images: {
		remotePatterns: readImageHosts(),
	},
};

export default nextConfig;
