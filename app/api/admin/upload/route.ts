import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { uploadImage } from "@/lib/r2";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set([
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
	"image/avif",
	"image/gif",
]);

export const runtime = "nodejs";

export async function POST(req: Request) {
	if (!(await isAuthenticated())) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	let form: FormData;
	try {
		form = await req.formData();
	} catch {
		return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
	}
	const file = form.get("file");
	if (!(file instanceof File)) {
		return NextResponse.json({ error: "Missing file" }, { status: 400 });
	}
	if (file.size === 0) {
		return NextResponse.json({ error: "Empty file" }, { status: 400 });
	}
	if (file.size > MAX_BYTES) {
		return NextResponse.json(
			{ error: "File too large (max 10MB)" },
			{ status: 413 },
		);
	}
	const contentType = (file.type || "").toLowerCase();
	if (!ALLOWED.has(contentType)) {
		return NextResponse.json(
			{ error: "Unsupported image type" },
			{ status: 415 },
		);
	}
	const arrayBuffer = await file.arrayBuffer();
	try {
		const uploaded = await uploadImage({
			filename: file.name || "upload",
			contentType,
			body: Buffer.from(arrayBuffer),
		});
		return NextResponse.json(uploaded);
	} catch (err) {
		const message = err instanceof Error ? err.message : "Upload failed";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
