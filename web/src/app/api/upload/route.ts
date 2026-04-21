import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const data = await req.formData();
  const file = data.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = Date.now() + "-" + file.name;

  const uploadPath = path.join(process.cwd(), "public/uploads");

  // krijo folder nëse nuk ekziston
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const filePath = path.join(uploadPath, fileName);

  fs.writeFileSync(filePath, buffer);

  return NextResponse.json({
    url: `/uploads/${fileName}`, // KJO është shumë e rëndësishme
  });
}