"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hashPassword, createSessionToken, verifySessionToken } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

// --- Authorization Helper ---
async function verifyAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("lala_admin_session")?.value;
  const session = verifySessionToken(token);
  if (!session) {
    throw new Error("Unauthorized access. Please login first.");
  }
  return session;
}

// --- Authentication Actions ---
export async function loginAction(formData: FormData) {
  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;

  if (!username || !password) {
    redirect("/admin/login?error=Username and password are required");
  }

  // Find admin user in database
  const admin = await db.admin.findUnique({
    where: { username },
  });

  if (!admin) {
    redirect("/admin/login?error=Invalid username or password");
  }

  // Verify PBKDF2 hashed password
  const hashedPassword = hashPassword(password);
  if (admin.password !== hashedPassword) {
    redirect("/admin/login?error=Invalid username or password");
  }

  // Generate token and set HTTP-only cookie
  const token = createSessionToken(username);
  const cookieStore = await cookies();
  
  cookieStore.set("lala_admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("lala_admin_session");
  redirect("/admin/login");
}

// --- Setting Actions ---
export async function updateSettingAction(key: string, value: string) {
  await verifyAdminAuth();
  
  if (!key) throw new Error("Missing setting key");

  await db.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

  revalidatePath("/");
}

// --- Story Actions ---
export async function addStoryAction(data: {
  title: string;
  description: string;
  durationText: string;
  ageRange: string;
  badge: string;
  imageSrc: string;
  audioSrc: string;
}) {
  await verifyAdminAuth();

  if (!data.title || !data.description || !data.durationText || !data.ageRange || !data.imageSrc || !data.audioSrc) {
    throw new Error("Missing required story fields");
  }

  await db.story.create({
    data: {
      title: data.title,
      description: data.description,
      durationText: data.durationText,
      ageRange: data.ageRange,
      badge: data.badge || null,
      imageSrc: data.imageSrc,
      audioSrc: data.audioSrc,
    },
  });

  revalidatePath("/");
}

export async function deleteStoryAction(id: string) {
  await verifyAdminAuth();

  if (!id) throw new Error("Missing story ID");

  await db.story.delete({
    where: { id },
  });

  revalidatePath("/");
}

// --- Testimonial Actions ---
export async function addTestimonialAction(data: {
  text: string;
  authorName: string;
  authorRole: string;
}) {
  await verifyAdminAuth();

  if (!data.text || !data.authorName || !data.authorRole) {
    throw new Error("Missing required testimonial fields");
  }

  const avatarLetter = data.authorName.trim().charAt(0).toUpperCase() || "L";

  await db.testimonial.create({
    data: {
      text: data.text,
      authorName: data.authorName,
      authorRole: data.authorRole,
      avatarLetter,
    },
  });

  revalidatePath("/");
}

export async function deleteTestimonialAction(id: string) {
  await verifyAdminAuth();

  if (!id) throw new Error("Missing testimonial ID");

  await db.testimonial.delete({
    where: { id },
  });

  revalidatePath("/");
}

// --- FAQ Actions ---
export async function addFaqAction(data: {
  question: string;
  answer: string;
}) {
  await verifyAdminAuth();

  if (!data.question || !data.answer) {
    throw new Error("Missing required FAQ fields");
  }

  const count = await db.fAQ.count();

  await db.fAQ.create({
    data: {
      question: data.question,
      answer: data.answer,
      order: count,
    },
  });

  revalidatePath("/help");
}

export async function deleteFaqAction(id: string) {
  await verifyAdminAuth();

  if (!id) throw new Error("Missing FAQ ID");

  await db.fAQ.delete({
    where: { id },
  });

  revalidatePath("/help");
}

// --- Product Actions Helper ---
async function saveUploadedFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  // Clean filename to prevent filesystem issues
  const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const dirPath = path.join(process.cwd(), "public/assets/images");
  
  // Ensure assets directory exists
  await fs.mkdir(dirPath, { recursive: true });
  
  const filePath = path.join(dirPath, filename);
  await fs.writeFile(filePath, buffer);
  return `/assets/images/${filename}`;
}

// --- Product Actions ---
export async function addProductAction(formData: FormData) {
  await verifyAdminAuth();
  
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const priceStr = formData.get("price") as string;
  const buyUrl = formData.get("buyUrl") as string;
  const category = formData.get("category") as string;
  const imageFile = formData.get("imageFile") as File;
  const imageUrlInput = formData.get("imageUrl") as string;

  if (!name || !description || !priceStr || !buyUrl || !category) {
    throw new Error("Missing required product fields");
  }

  let imageUrl = imageUrlInput || "/assets/images/letter_garden.jpg";
  if (imageFile && imageFile.size > 0) {
    imageUrl = await saveUploadedFile(imageFile);
  }

  await db.product.create({
    data: {
      name,
      description,
      price: parseFloat(priceStr) || 0,
      imageUrl,
      buyUrl,
      category,
    },
  });

  revalidatePath("/products");
  revalidatePath("/premium");
  revalidatePath("/");
}

export async function editProductAction(id: string, formData: FormData) {
  await verifyAdminAuth();

  if (!id) throw new Error("Missing product ID");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const priceStr = formData.get("price") as string;
  const buyUrl = formData.get("buyUrl") as string;
  const category = formData.get("category") as string;
  const imageFile = formData.get("imageFile") as File;
  const existingImageUrl = formData.get("existingImageUrl") as string;
  const imageUrlInput = formData.get("imageUrl") as string;

  if (!name || !description || !priceStr || !buyUrl || !category) {
    throw new Error("Missing required product fields");
  }

  let imageUrl = imageUrlInput || existingImageUrl || "/assets/images/letter_garden.jpg";
  if (imageFile && imageFile.size > 0) {
    imageUrl = await saveUploadedFile(imageFile);
  }

  await db.product.update({
    where: { id },
    data: {
      name,
      description,
      price: parseFloat(priceStr) || 0,
      imageUrl,
      buyUrl,
      category,
    },
  });

  revalidatePath("/products");
  revalidatePath("/premium");
  revalidatePath("/");
}

export async function deleteProductAction(id: string) {
  await verifyAdminAuth();

  if (!id) throw new Error("Missing product ID");

  await db.product.delete({
    where: { id },
  });

  revalidatePath("/products");
  revalidatePath("/premium");
  revalidatePath("/");
}

// --- Pricing Plan Actions ---
export async function addPlanAction(data: {
  name: string;
  price: string;
  period: string;
  features: string;
  isPopular: boolean;
  badge: string;
}) {
  await verifyAdminAuth();

  if (!data.name || !data.price || !data.period || !data.features) {
    throw new Error("Missing required pricing plan fields");
  }

  const count = await db.pricingPlan.count();

  await db.pricingPlan.create({
    data: {
      name: data.name,
      price: data.price,
      period: data.period,
      features: data.features,
      isPopular: data.isPopular,
      badge: data.badge || null,
      order: count,
    },
  });

  revalidatePath("/premium");
  revalidatePath("/");
}

export async function deletePlanAction(id: string) {
  await verifyAdminAuth();

  if (!id) throw new Error("Missing plan ID");

  await db.pricingPlan.delete({
    where: { id },
  });

  revalidatePath("/premium");
  revalidatePath("/");
}

export async function editPlanAction(
  id: string,
  data: {
    name: string;
    price: string;
    period: string;
    features: string;
    isPopular: boolean;
    badge: string;
  }
) {
  await verifyAdminAuth();

  if (!id) throw new Error("Missing plan ID");
  if (!data.name || !data.price || !data.period || !data.features) {
    throw new Error("Missing required pricing plan fields");
  }

  await db.pricingPlan.update({
    where: { id },
    data: {
      name: data.name,
      price: data.price,
      period: data.period,
      features: data.features,
      isPopular: data.isPopular,
      badge: data.badge || null,
    },
  });

  revalidatePath("/premium");
  revalidatePath("/");
}

// --- Program Application Actions (Differently Abled kids) ---
export async function submitProgramApplicationAction(data: {
  parentName: string;
  childName: string;
  childAge: number;
  email: string;
  phone?: string;
  message: string;
}) {
  if (!data.parentName || !data.childName || !data.childAge || !data.email || !data.message) {
    throw new Error("Missing required fields");
  }

  await db.programApplication.create({
    data: {
      parentName: data.parentName,
      childName: data.childName,
      childAge: Number(data.childAge),
      email: data.email,
      phone: data.phone || null,
      message: data.message,
      status: "Pending",
    },
  });

  revalidatePath("/admin");
}

export async function updateApplicationStatusAction(id: string, status: string) {
  await verifyAdminAuth();

  if (!id || !status) throw new Error("Missing application ID or status");

  await db.programApplication.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin");
}

export async function deleteApplicationAction(id: string) {
  await verifyAdminAuth();

  if (!id) throw new Error("Missing application ID");

  await db.programApplication.delete({
    where: { id },
  });

  revalidatePath("/admin");
}

// --- Background Video Actions Helper ---
async function saveUploadedVideoFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const dirPath = path.join(process.cwd(), "public/assets/video");
  
  await fs.mkdir(dirPath, { recursive: true });
  
  const filePath = path.join(dirPath, filename);
  await fs.writeFile(filePath, buffer);
  return `/assets/video/${filename}`;
}

async function deleteLocalFile(fileUrl: string) {
  if (!fileUrl) return;
  if (fileUrl.startsWith("/assets/")) {
    try {
      const filePath = path.join(process.cwd(), "public", fileUrl);
      await fs.unlink(filePath);
    } catch (err) {
      console.error("Failed to delete local file:", fileUrl, err);
    }
  }
}

// --- Background Video CRUD Actions ---
export async function addBgVideoAction(formData: FormData) {
  await verifyAdminAuth();

  const title = formData.get("title") as string;
  const videoUrlInput = formData.get("videoUrl") as string;
  const videoFile = formData.get("videoFile") as File;

  if (!title) {
    throw new Error("Title is required for background video");
  }

  let videoUrl = videoUrlInput || "";
  if (videoFile && videoFile.size > 0) {
    videoUrl = await saveUploadedVideoFile(videoFile);
  }

  // Create background video. If it's the first one, make it active.
  const count = await db.bgVideo.count();
  const isActive = count === 0;

  await db.bgVideo.create({
    data: {
      title,
      videoUrl,
      isActive,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function editBgVideoAction(id: string, formData: FormData) {
  await verifyAdminAuth();

  if (!id) throw new Error("Missing video ID");

  const title = formData.get("title") as string;
  const videoUrlInput = formData.get("videoUrl") as string;
  const videoFile = formData.get("videoFile") as File;
  const existingVideoUrl = formData.get("existingVideoUrl") as string;

  if (!title) {
    throw new Error("Title is required");
  }

  let videoUrl = videoUrlInput || existingVideoUrl || "";
  if (videoFile && videoFile.size > 0) {
    // Delete existing local video if we upload a new one
    if (existingVideoUrl && existingVideoUrl !== videoUrlInput) {
      await deleteLocalFile(existingVideoUrl);
    }
    videoUrl = await saveUploadedVideoFile(videoFile);
  }

  await db.bgVideo.update({
    where: { id },
    data: {
      title,
      videoUrl,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteBgVideoAction(id: string) {
  await verifyAdminAuth();

  if (!id) throw new Error("Missing video ID");

  const video = await db.bgVideo.findUnique({
    where: { id },
  });

  if (!video) throw new Error("Video not found");

  // Prevent deleting the active video unless it is the only one
  if (video.isActive) {
    const count = await db.bgVideo.count();
    if (count > 1) {
      throw new Error("Cannot delete the active background video. Please set another video active first.");
    }
  }

  // Delete local video file if applicable
  if (video.videoUrl) {
    await deleteLocalFile(video.videoUrl);
  }

  await db.bgVideo.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function setActiveBgVideoAction(id: string) {
  await verifyAdminAuth();

  if (!id) throw new Error("Missing video ID");

  // Deactivate all videos
  await db.bgVideo.updateMany({
    data: { isActive: false },
  });

  // Activate selected video
  await db.bgVideo.update({
    where: { id },
    data: { isActive: true },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

// --- Program Actions ---

async function saveUploadedImageFile(file: File, subDir: string = "images"): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const dirPath = path.join(process.cwd(), `public/assets/${subDir}`);
  await fs.mkdir(dirPath, { recursive: true });
  const filePath = path.join(dirPath, filename);
  await fs.writeFile(filePath, buffer);
  return `/assets/${subDir}/${filename}`;
}

export async function addProgramAction(formData: FormData) {
  await verifyAdminAuth();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const location = formData.get("location") as string;
  const formFields = formData.get("formFields") as string;
  const bannerFile = formData.get("bannerFile") as File;
  const qrFile = formData.get("qrFile") as File;
  const imageUrlInput = formData.get("imageUrl") as string;
  const qrUrlInput = formData.get("qrImageUrl") as string;

  if (!title || !description || !date || !location) {
    throw new Error("Title, description, date, and location are required.");
  }

  let imageUrl = imageUrlInput || "";
  if (bannerFile && bannerFile.size > 0) {
    imageUrl = await saveUploadedImageFile(bannerFile, "programs");
  }

  let qrImageUrl = qrUrlInput || "";
  if (qrFile && qrFile.size > 0) {
    qrImageUrl = await saveUploadedImageFile(qrFile, "programs");
  }

  await db.program.create({
    data: {
      title,
      description,
      date,
      location,
      imageUrl: imageUrl || null,
      qrImageUrl: qrImageUrl || null,
      isActive: true,
      formFields: formFields || "[]",
    },
  });

  revalidatePath("/programs");
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function editProgramAction(id: string, formData: FormData) {
  await verifyAdminAuth();

  if (!id) throw new Error("Missing program ID");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const location = formData.get("location") as string;
  const formFields = formData.get("formFields") as string;
  const bannerFile = formData.get("bannerFile") as File;
  const qrFile = formData.get("qrFile") as File;
  const existingImageUrl = formData.get("existingImageUrl") as string;
  const existingQrUrl = formData.get("existingQrUrl") as string;
  const imageUrlInput = formData.get("imageUrl") as string;
  const qrUrlInput = formData.get("qrImageUrl") as string;

  if (!title || !description || !date || !location) {
    throw new Error("Title, description, date, and location are required.");
  }

  let imageUrl = imageUrlInput || existingImageUrl || "";
  if (bannerFile && bannerFile.size > 0) {
    if (existingImageUrl) await deleteLocalFile(existingImageUrl);
    imageUrl = await saveUploadedImageFile(bannerFile, "programs");
  }

  let qrImageUrl = qrUrlInput || existingQrUrl || "";
  if (qrFile && qrFile.size > 0) {
    if (existingQrUrl) await deleteLocalFile(existingQrUrl);
    qrImageUrl = await saveUploadedImageFile(qrFile, "programs");
  }

  await db.program.update({
    where: { id },
    data: {
      title,
      description,
      date,
      location,
      imageUrl: imageUrl || null,
      qrImageUrl: qrImageUrl || null,
      formFields: formFields || "[]",
    },
  });

  revalidatePath("/programs");
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteProgramAction(id: string) {
  await verifyAdminAuth();

  if (!id) throw new Error("Missing program ID");

  const program = await db.program.findUnique({ where: { id } });
  if (!program) throw new Error("Program not found");

  if (program.imageUrl) await deleteLocalFile(program.imageUrl);
  if (program.qrImageUrl) await deleteLocalFile(program.qrImageUrl);

  await db.program.delete({ where: { id } });

  revalidatePath("/programs");
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function toggleProgramActiveAction(id: string) {
  await verifyAdminAuth();

  if (!id) throw new Error("Missing program ID");

  const program = await db.program.findUnique({ where: { id } });
  if (!program) throw new Error("Program not found");

  await db.program.update({
    where: { id },
    data: { isActive: !program.isActive },
  });

  revalidatePath("/programs");
  revalidatePath("/");
  revalidatePath("/admin");
}

// --- Program Registration Actions ---

export async function submitProgramRegistrationAction(programId: string, responses: Record<string, string>) {
  if (!programId) throw new Error("Missing program ID");
  if (!responses || Object.keys(responses).length === 0) throw new Error("No form data provided");

  const program = await db.program.findUnique({ where: { id: programId } });
  if (!program || !program.isActive) throw new Error("Program not found or is not active.");

  await db.programRegistration.create({
    data: {
      programId,
      responses: JSON.stringify(responses),
      status: "Pending",
    },
  });

  revalidatePath("/admin");
}

export async function updateRegistrationStatusAction(id: string, status: string) {
  await verifyAdminAuth();

  if (!id || !status) throw new Error("Missing registration ID or status");

  await db.programRegistration.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin");
}

export async function deleteRegistrationAction(id: string) {
  await verifyAdminAuth();

  if (!id) throw new Error("Missing registration ID");

  await db.programRegistration.delete({ where: { id } });

  revalidatePath("/admin");
}

