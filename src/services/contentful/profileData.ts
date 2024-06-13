import type { Asset } from "contentful";
import { contentfulClient } from "./client";

type ProfileData = {
	picture: Asset;
	titleAndCompany: string;
	bio: string;
};

export async function getProfileData() {
	const data = await contentfulClient.getEntries<ProfileData>({
		content_type: "profile",
		limit: 1,
		order: "-sys.createdAt",
	});

	return data.items[0];
}
