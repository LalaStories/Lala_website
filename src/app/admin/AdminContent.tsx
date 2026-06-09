"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addStoryAction,
  deleteStoryAction,
  addTestimonialAction,
  deleteTestimonialAction,
  addFaqAction,
  deleteFaqAction,
  updateSettingAction,
  addProductAction,
  editProductAction,
  deleteProductAction,
  addPlanAction,
  editPlanAction,
  deletePlanAction,
  updateApplicationStatusAction,
  deleteApplicationAction,
  logoutAction,
  addBgVideoAction,
  editBgVideoAction,
  deleteBgVideoAction,
  setActiveBgVideoAction,
  addProgramAction,
  editProgramAction,
  deleteProgramAction,
  toggleProgramActiveAction,
  updateRegistrationStatusAction,
  deleteRegistrationAction,
  addAdminAction,
  editAdminAction,
  deleteAdminAction,
} from "./actions";

interface Story {
  id: string;
  title: string;
  description: string;
  durationText: string;
  ageRange: string;
  badge: string | null;
  imageSrc: string;
  audioSrc: string;
}

interface Testimonial {
  id: string;
  text: string;
  avatarLetter: string;
  authorName: string;
  authorRole: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  buyUrl: string;
  category: string;
  createdAt: Date;
}

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string;
  isPopular: boolean;
  badge: string | null;
  order: number;
}

interface ProgramApplication {
  id: string;
  parentName: string;
  childName: string;
  childAge: number;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  createdAt: Date;
}

interface Setting {
  key: string;
  value: string;
}

interface BgVideo {
  id: string;
  title: string;
  videoUrl: string;
  isActive: boolean;
  createdAt: Date;
}

interface FormField {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "number" | "textarea" | "select";
  required: boolean;
  options?: string;
}

interface ProgramRegistration {
  id: string;
  programId: string;
  responses: string;
  status: string;
  createdAt: Date;
}

interface Program {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string | null;
  qrImageUrl: string | null;
  isActive: boolean;
  formFields: string;
  registrations: ProgramRegistration[];
  createdAt: Date;
}

interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

interface AdminContentProps {
  initialStories: Story[];
  initialTestimonials: Testimonial[];
  initialFaqs: FAQ[];
  initialProducts: Product[];
  initialPlans: PricingPlan[];
  initialApplications: ProgramApplication[];
  initialSettings: Setting[];
  initialBgVideos: BgVideo[];
  initialPrograms: Program[];
  initialAdmins: AdminUser[];
  currentUsername: string;
}

type Tab = "video" | "stories" | "testimonials" | "faqs" | "products" | "plans" | "applications" | "programs" | "users";

export default function AdminContent({
  initialStories,
  initialTestimonials,
  initialFaqs,
  initialProducts,
  initialPlans,
  initialApplications,
  initialSettings,
  initialBgVideos,
  initialPrograms,
  initialAdmins,
  currentUsername,
}: AdminContentProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("video");
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Background Video CRUD states
  const [editingBgVideoId, setEditingBgVideoId] = useState<string | null>(null);
  const [bgVideoFile, setBgVideoFile] = useState<File | null>(null);
  const [bgVideoForm, setBgVideoForm] = useState({
    title: "",
    videoUrl: "",
  });

  // Form states
  const [storyForm, setStoryForm] = useState({
    title: "",
    description: "",
    durationText: "",
    ageRange: "",
    badge: "",
    imageSrc: "/assets/images/EN 671.jpg",
    audioSrc: "/assets/audio/Battle of the ants - 4web.mp3",
  });

  const [testimonialForm, setTestimonialForm] = useState({
    text: "",
    authorName: "",
    authorRole: "",
  });

  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
  });

  // Product CRUD states
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "/assets/images/letter_garden.jpg",
    buyUrl: "https://amazon.in",
    category: "Book",
  });

  // Pricing Plan CRUD states
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [planForm, setPlanForm] = useState({
    name: "",
    price: "",
    period: "month",
    features: "",
    isPopular: false,
    badge: "",
  });

  // Program CRUD states
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [programBannerFile, setProgramBannerFile] = useState<File | null>(null);
  const [programQrFile, setProgramQrFile] = useState<File | null>(null);
  const [programForm, setProgramForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    imageUrl: "",
    qrImageUrl: "",
  });
  const [programFormFields, setProgramFormFields] = useState<FormField[]>([]);
  const [viewingRegistrationsFor, setViewingRegistrationsFor] = useState<string | null>(null);

  // User Management states
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins);
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [adminForm, setAdminForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "editor",
  });

  const showFeedback = (success: string | null, error: string | null) => {
    setSuccessMessage(success);
    setErrorMessage(error);
    setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 4500);
  };

  // --- Background Video Handlers ---
  const handleSaveBgVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append("title", bgVideoForm.title);
    formData.append("videoUrl", bgVideoForm.videoUrl);
    if (bgVideoFile) {
      formData.append("videoFile", bgVideoFile);
    }

    startTransition(async () => {
      try {
        if (editingBgVideoId) {
          formData.append("existingVideoUrl", bgVideoForm.videoUrl);
          await editBgVideoAction(editingBgVideoId, formData);
          showFeedback("Background video updated successfully!", null);
          setEditingBgVideoId(null);
        } else {
          await addBgVideoAction(formData);
          showFeedback("Background video added successfully!", null);
        }
        
        setBgVideoForm({ title: "", videoUrl: "" });
        setBgVideoFile(null);
        const fileInput = document.getElementById("bgVideoFile") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        
        router.refresh();
      } catch (err: any) {
        showFeedback(null, err.message || "Failed to save background video");
      }
    });
  };

  const handleDeleteBgVideo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this background video?")) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        await deleteBgVideoAction(id);
        showFeedback("Background video deleted successfully!", null);
        router.refresh();
      } catch (err: any) {
        showFeedback(null, err.message || "Failed to delete background video");
      }
    });
  };

  const handleSetActiveBgVideo = async (id: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        await setActiveBgVideoAction(id);
        showFeedback("Background video activated successfully!", null);
        router.refresh();
      } catch (err: any) {
        showFeedback(null, err.message || "Failed to set active background video");
      }
    });
  };

  const handleAddStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        await addStoryAction(storyForm);
        showFeedback("Story added successfully!", null);
        setStoryForm({
          title: "",
          description: "",
          durationText: "",
          ageRange: "",
          badge: "",
          imageSrc: "/assets/images/EN 671.jpg",
          audioSrc: "/assets/audio/Battle of the ants - 4web.mp3",
        });
        router.refresh();
      } catch (err: any) {
        showFeedback(null, err.message || "Failed to add story");
      }
    });
  };

  const handleDeleteStory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this story?")) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        await deleteStoryAction(id);
        showFeedback("Story deleted successfully!", null);
        router.refresh();
      } catch (err: any) {
        showFeedback(null, err.message || "Failed to delete story");
      }
    });
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        await addTestimonialAction(testimonialForm);
        showFeedback("Testimonial added successfully!", null);
        setTestimonialForm({ text: "", authorName: "", authorRole: "" });
        router.refresh();
      } catch (err: any) {
        showFeedback(null, err.message || "Failed to add testimonial");
      }
    });
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        await deleteTestimonialAction(id);
        showFeedback("Testimonial deleted successfully!", null);
        router.refresh();
      } catch (err: any) {
        showFeedback(null, err.message || "Failed to delete testimonial");
      }
    });
  };

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        await addFaqAction(faqForm);
        showFeedback("FAQ added successfully!", null);
        setFaqForm({ question: "", answer: "" });
        router.refresh();
      } catch (err: any) {
        showFeedback(null, err.message || "Failed to add FAQ");
      }
    });
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        await deleteFaqAction(id);
        showFeedback("FAQ deleted successfully!", null);
        router.refresh();
      } catch (err: any) {
        showFeedback(null, err.message || "Failed to delete FAQ");
      }
    });
  };

  // Product CRUD Form Handler
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Build FormData to support multipart file upload
    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("description", productForm.description);
    formData.append("price", productForm.price);
    formData.append("buyUrl", productForm.buyUrl);
    formData.append("category", productForm.category);
    formData.append("imageUrl", productForm.imageUrl); // Fallback URL string
    if (productImageFile) {
      formData.append("imageFile", productImageFile);
    }

    startTransition(async () => {
      try {
        if (editingProductId) {
          formData.append("existingImageUrl", productForm.imageUrl);
          await editProductAction(editingProductId, formData);
          showFeedback("Product updated successfully!", null);
          setEditingProductId(null);
        } else {
          await addProductAction(formData);
          showFeedback("Product added successfully!", null);
        }
        
        setProductForm({
          name: "",
          description: "",
          price: "",
          imageUrl: "/assets/images/letter_garden.jpg",
          buyUrl: "https://amazon.in",
          category: "Book",
        });
        setProductImageFile(null);
        // Reset file input element
        const fileInput = document.getElementById("productImageFile") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        
        router.refresh();
      } catch (err: any) {
        showFeedback(null, err.message || "Failed to save product");
      }
    });
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        await deleteProductAction(id);
        showFeedback("Product deleted successfully!", null);
        router.refresh();
      } catch (err: any) {
        showFeedback(null, err.message || "Failed to delete product");
      }
    });
  };

  // Pricing Plan CRUD Form Handler
  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        if (editingPlanId) {
          await editPlanAction(editingPlanId, planForm);
          showFeedback("Pricing plan updated successfully!", null);
          setEditingPlanId(null);
        } else {
          await addPlanAction(planForm);
          showFeedback("Pricing plan added successfully!", null);
        }
        
        setPlanForm({
          name: "",
          price: "",
          period: "month",
          features: "",
          isPopular: false,
          badge: "",
        });
        router.refresh();
      } catch (err: any) {
        showFeedback(null, err.message || "Failed to save pricing plan");
      }
    });
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pricing plan?")) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        await deletePlanAction(id);
        showFeedback("Pricing plan deleted successfully!", null);
        router.refresh();
      } catch (err: any) {
        showFeedback(null, err.message || "Failed to delete pricing plan");
      }
    });
  };

  const handleUpdateAppStatus = async (id: string, status: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        await updateApplicationStatusAction(id, status);
        showFeedback(`Application status marked as ${status}!`, null);
        router.refresh();
      } catch (err: any) {
        showFeedback(null, err.message || "Failed to update application status");
      }
    });
  };

  const handleDeleteApplication = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        await deleteApplicationAction(id);
        showFeedback("Application deleted successfully!", null);
        router.refresh();
      } catch (err: any) {
        showFeedback(null, err.message || "Failed to delete application");
      }
    });
  };

  // --- Program Handlers ---
  const resetProgramForm = () => {
    setEditingProgramId(null);
    setProgramBannerFile(null);
    setProgramQrFile(null);
    setProgramForm({ title: "", description: "", date: "", location: "", imageUrl: "", qrImageUrl: "" });
    setProgramFormFields([]);
    const bannerInput = document.getElementById("programBannerFile") as HTMLInputElement;
    const qrInput = document.getElementById("programQrFile") as HTMLInputElement;
    if (bannerInput) bannerInput.value = "";
    if (qrInput) qrInput.value = "";
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append("title", programForm.title);
    formData.append("description", programForm.description);
    formData.append("date", programForm.date);
    formData.append("location", programForm.location);
    formData.append("imageUrl", programForm.imageUrl);
    formData.append("qrImageUrl", programForm.qrImageUrl);
    formData.append("formFields", JSON.stringify(programFormFields));
    if (programBannerFile) formData.append("bannerFile", programBannerFile);
    if (programQrFile) formData.append("qrFile", programQrFile);

    startTransition(async () => {
      try {
        if (editingProgramId) {
          formData.append("existingImageUrl", programForm.imageUrl);
          formData.append("existingQrUrl", programForm.qrImageUrl);
          await editProgramAction(editingProgramId, formData);
          showFeedback("Program updated successfully!", null);
        } else {
          await addProgramAction(formData);
          showFeedback("Program created successfully!", null);
        }
        resetProgramForm();
        router.refresh();
      } catch (err: any) {
        showFeedback(null, err.message || "Failed to save program");
      }
    });
  };

  const handleDeleteProgram = async (id: string) => {
    if (!confirm("Delete this program and all its registrations?")) return;
    startTransition(async () => {
      try {
        await deleteProgramAction(id);
        showFeedback("Program deleted!", null);
        router.refresh();
      } catch (err: any) {
        showFeedback(null, err.message || "Failed to delete program");
      }
    });
  };

  const handleToggleProgramActive = async (id: string) => {
    startTransition(async () => {
      try {
        await toggleProgramActiveAction(id);
        showFeedback("Program status updated!", null);
        router.refresh();
      } catch (err: any) {
        showFeedback(null, err.message || "Failed to toggle program");
      }
    });
  };

  const addFormField = () => {
    setProgramFormFields((prev) => [
      ...prev,
      { id: `field_${Date.now()}`, label: "", type: "text", required: false },
    ]);
  };

  const removeFormField = (id: string) => {
    setProgramFormFields((prev) => prev.filter((f) => f.id !== id));
  };

  const updateFormField = (id: string, updates: Partial<FormField>) => {
    setProgramFormFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const handleUpdateRegistrationStatus = async (id: string, status: string) => {
    startTransition(async () => {
      try {
        await updateRegistrationStatusAction(id, status);
        showFeedback(`Registration marked as ${status}!`, null);
        router.refresh();
      } catch (err: any) {
        showFeedback(null, err.message || "Failed to update registration");
      }
    });
  };

  const handleDeleteRegistration = async (id: string) => {
    if (!confirm("Delete this registration?")) return;
    startTransition(async () => {
      try {
        await deleteRegistrationAction(id);
        showFeedback("Registration deleted!", null);
        router.refresh();
      } catch (err: any) {
        showFeedback(null, err.message || "Failed to delete registration");
      }
    });
  };

  const handleLogout = async () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  // --- User Management Handlers ---
  const handleSaveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        if (editingAdminId) {
          await editAdminAction(editingAdminId, {
            name: adminForm.name,
            email: adminForm.email,
            role: adminForm.role,
            password: adminForm.password || undefined,
          });
          showFeedback("User updated successfully!", null);
          setEditingAdminId(null);
        } else {
          await addAdminAction(adminForm);
          showFeedback("User added successfully!", null);
        }
        setAdminForm({ username: "", name: "", email: "", password: "", role: "editor" });
        router.refresh();
      } catch (err: any) {
        showFeedback(null, err.message || "Failed to save user");
      }
    });
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        await deleteAdminAction(id);
        setAdmins((prev) => prev.filter((a) => a.id !== id));
        showFeedback("User deleted successfully!", null);
        router.refresh();
      } catch (err: any) {
        showFeedback(null, err.message || "Failed to delete user");
      }
    });
  };

  // Professional SVG Icons for vertical sidebar
  const navigationItems = [
    {
      id: "video",
      label: "Background Video",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
      ),
    },
    {
      id: "stories",
      label: "Stories Library",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" /></svg>
      ),
    },
    {
      id: "testimonials",
      label: "Reviews & Feedback",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.5c1.153-.086 2.294-.213 3.423-.379 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v5.772Z" /></svg>
      ),
    },
    {
      id: "faqs",
      label: "Support FAQs",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>
      ),
    },
    {
      id: "products",
      label: "Books & Toys Shop",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
      ),
    },
    {
      id: "plans",
      label: "Pricing Plans",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
      ),
    },
    {
      id: "applications",
      label: "Free Program Apps",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>
      ),
    },
    {
      id: "programs",
      label: "Programs & Events",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" /></svg>
      ),
    },
    {
      id: "users",
      label: "Users & Permissions",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
      ),
    },
  ];


  return (
    <div className="min-h-screen bg-[#0F0826] text-white font-body flex flex-col md:flex-row relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/5 blur-3xl pointer-events-none" />

      {/* LEFT SIDEBAR navigation */}
      <aside className="w-full md:w-64 bg-black/20 border-r border-white/10 flex flex-col p-6 space-y-6 z-20 shrink-0 md:sticky md:top-0 md:h-screen justify-between">
        <div className="space-y-6">
          {/* Dashboard Title Branding */}
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A2F] animate-pulse" />
            <h1 className="font-heading text-lg font-extrabold tracking-tight">
              LALA <span className="text-[#FF7A2F]">Admin</span>
            </h1>
          </div>

          {/* Navigation vertical list - standard premium icons without emojis */}
          <nav className="flex flex-col gap-1.5">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-xl text-[11px] font-extrabold uppercase tracking-wider transition-all border-none bg-transparent cursor-pointer select-none text-left ${
                  activeTab === item.id
                    ? "bg-[#FF7A2F]/15 text-[#FF7A2F] shadow-sm shadow-orange-500/5"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className={activeTab === item.id ? "text-[#FF7A2F]" : "text-white/60"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer links */}
        <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
          <a
            href="/"
            className="text-xs text-white/50 hover:text-white transition-all py-1 flex items-center gap-2 font-semibold select-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253" /></svg>
            <span>View Website</span>
          </a>
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="text-left bg-transparent border-none text-xs text-rose-400/80 hover:text-rose-400 cursor-pointer py-1 flex items-center gap-2 font-semibold select-none active:scale-95 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" /></svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* RIGHT WORKSPACE Main Pane */}
      <main className="grow p-6 md:p-10 relative z-10 overflow-y-auto max-w-6xl w-full">
        <div className="space-y-6">
          
          {/* Breadcrumb section header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF7A2F]">
              Dashboard / {activeTab}
            </div>
            {isPending && (
              <div className="flex items-center gap-2 text-xs text-white/50 animate-pulse">
                <svg className="animate-spin h-3.5 w-3.5 text-[#FF7A2F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Changes...
              </div>
            )}
          </div>

          {/* Status Messages */}
          {successMessage && (
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-2xl flex items-center gap-3 animate-fade-in shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              <span className="text-sm font-semibold">{successMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div className="p-4 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-2xl flex items-center gap-3 animate-fade-in shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
              <span className="text-sm font-semibold">{errorMessage}</span>
            </div>
          )}

          {/* Split Pane columns grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Col list pane */}
            <div className="lg:col-span-7 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl space-y-6">
              
              {/* 1. Background Video settings */}
              {activeTab === "video" && (
                <>
                  <h2 className="font-heading font-extrabold text-xl border-b border-white/10 pb-3">
                    Manage Background Videos ({initialBgVideos.length})
                  </h2>
                  {initialBgVideos.length > 0 ? (
                    <div className="space-y-4 mt-4">
                      {initialBgVideos.map((vid) => (
                        <div
                          key={vid.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#FF7A2F]/30 hover:bg-white/10 transition-all group"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* Inline video preview */}
                            <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black flex items-center justify-center relative">
                              {vid.videoUrl ? (
                                <video
                                  src={vid.videoUrl}
                                  muted
                                  playsInline
                                  className="w-full h-full object-cover"
                                  onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                                  onMouseOut={(e) => {
                                    const v = e.target as HTMLVideoElement;
                                    v.pause();
                                    v.currentTime = 0;
                                  }}
                                />
                              ) : (
                                <span className="text-[10px] text-white/30 font-bold uppercase">Static</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-heading font-bold text-sm truncate max-w-[200px] sm:max-w-xs">
                                {vid.title}
                              </h3>
                              <p className="text-white/40 font-mono text-[9px] truncate max-w-[200px] sm:max-w-xs mt-0.5">
                                {vid.videoUrl || "Default canvas starry night (No video loop)"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2.5">
                            {/* Active badge / button */}
                            {vid.isActive ? (
                              <span className="text-[9px] font-extrabold uppercase px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                                Active
                              </span>
                            ) : (
                              <button
                                onClick={() => handleSetActiveBgVideo(vid.id)}
                                disabled={isPending}
                                className="px-2.5 py-1 rounded-full border border-white/15 bg-white/5 hover:bg-[#FF7A2F]/15 hover:text-[#FF7A2F] text-[9px] font-extrabold uppercase tracking-wide cursor-pointer transition-all disabled:opacity-50 select-none"
                              >
                                Set Active
                              </button>
                            )}

                            {/* Edit Action */}
                            <button
                              onClick={() => {
                                setEditingBgVideoId(vid.id);
                                setBgVideoForm({
                                  title: vid.title,
                                  videoUrl: vid.videoUrl,
                                });
                                setBgVideoFile(null);
                                const fileInput = document.getElementById("bgVideoFile") as HTMLInputElement;
                                if (fileInput) fileInput.value = "";
                              }}
                              className="p-2 rounded-lg border border-white/10 hover:border-amber-500/30 bg-white/5 hover:bg-amber-500/10 text-white/60 hover:text-amber-400 transition-all cursor-pointer"
                              title="Edit Video Details"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>
                            </button>

                            {/* Delete Action */}
                            <button
                              onClick={() => handleDeleteBgVideo(vid.id)}
                              disabled={isPending || vid.isActive}
                              className="p-2 rounded-lg border border-white/10 hover:border-rose-500/30 bg-white/5 hover:bg-rose-500/10 text-white/60 hover:text-rose-400 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Delete Video"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-12 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-white/20 mb-3"><path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375C2.754 3.75 2.25 4.254 2.25 4.875v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
                      <p className="text-white/40 text-sm font-semibold">No background videos configured yet.</p>
                    </div>
                  )}
                </>
              )}

              {/* 2. Stories Tab */}
              {activeTab === "stories" && (
                <>
                  <h2 className="font-heading font-extrabold text-xl border-b border-white/10 pb-3">
                    Manage Stories ({initialStories.length})
                  </h2>
                  {initialStories.length > 0 ? (
                    <div className="space-y-4">
                      {initialStories.map((story) => (
                        <div
                          key={story.id}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#FF7A2F]/30 hover:bg-white/10 transition-all group"
                        >
                          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-slate-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={story.imageSrc}
                              alt={story.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-heading font-bold text-base truncate">
                                {story.title}
                              </h3>
                              {story.badge && (
                                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#FF7A2F]/20 text-[#FF7A2F] border border-[#FF7A2F]/30">
                                  {story.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-white/60 text-xs truncate max-w-md mt-0.5">
                              {story.description}
                            </p>
                            <div className="flex gap-4 mt-1.5 text-[10px] font-bold text-white/40">
                              <span className="flex items-center gap-1 select-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5 text-white/40"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                                {story.durationText}
                              </span>
                              <span className="flex items-center gap-1 select-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5 text-white/40"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                                {story.ageRange}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteStory(story.id)}
                            disabled={isPending}
                            className="p-2.5 rounded-xl border border-white/10 hover:border-rose-500/30 bg-white/5 hover:bg-rose-500/10 text-white/60 hover:text-rose-400 transition-all cursor-pointer shrink-0"
                            title="Delete Story"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-12 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-white/20 mb-3"><path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375C2.754 3.75 2.25 4.254 2.25 4.875v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
                      <p className="text-white/40 text-sm font-semibold">No stories created yet.</p>
                    </div>
                  )}
                </>
              )}

              {/* 3. Testimonials Tab */}
              {activeTab === "testimonials" && (
                <>
                  <h2 className="font-heading font-extrabold text-xl border-b border-white/10 pb-3">
                    Manage Testimonials ({initialTestimonials.length})
                  </h2>
                  {initialTestimonials.length > 0 ? (
                    <div className="space-y-4">
                      {initialTestimonials.map((test) => (
                        <div
                          key={test.id}
                          className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#FF7A2F]/30 hover:bg-white/10 transition-all group"
                        >
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#FF7A2F] to-[#E55A10] flex items-center justify-center font-bold shrink-0 shadow-md">
                            {test.avatarLetter}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h3 className="font-heading font-bold text-sm leading-tight">
                                  {test.authorName}
                                </h3>
                                <span className="text-[10px] text-[#FF7A2F] font-bold block uppercase tracking-wide mt-0.5">
                                  {test.authorRole}
                                </span>
                              </div>
                              <button
                                onClick={() => handleDeleteTestimonial(test.id)}
                                disabled={isPending}
                                className="p-2 rounded-lg border border-white/10 hover:border-rose-500/30 bg-white/5 hover:bg-rose-500/10 text-white/60 hover:text-rose-400 transition-all cursor-pointer shrink-0"
                                title="Delete Testimonial"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                              </button>
                            </div>
                            <p className="text-white/70 text-xs italic mt-2.5 leading-relaxed bg-black/10 p-3 rounded-xl border border-white/5">
                              {test.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-12 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-white/20 mb-3"><path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375C2.754 3.75 2.25 4.254 2.25 4.875v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
                      <p className="text-white/40 text-sm font-semibold">No testimonials created yet.</p>
                    </div>
                  )}
                </>
              )}

              {/* 4. FAQs Tab */}
              {activeTab === "faqs" && (
                <>
                  <h2 className="font-heading font-extrabold text-xl border-b border-white/10 pb-3">
                    Manage FAQs ({initialFaqs.length})
                  </h2>
                  {initialFaqs.length > 0 ? (
                    <div className="space-y-4">
                      {initialFaqs.map((faq) => (
                        <div
                          key={faq.id}
                          className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#FF7A2F]/30 hover:bg-white/10 transition-all group"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest pt-1 shrink-0">
                              FAQ #{faq.order + 1}
                            </span>
                            <h3 className="font-heading font-bold text-sm leading-snug flex-1">
                              {faq.question}
                            </h3>
                            <button
                              onClick={() => handleDeleteFaq(faq.id)}
                              disabled={isPending}
                              className="p-2 rounded-lg border border-white/10 hover:border-rose-500/30 bg-white/5 hover:bg-rose-500/10 text-white/60 hover:text-rose-400 transition-all cursor-pointer shrink-0"
                              title="Delete FAQ"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                            </button>
                          </div>
                          <p className="text-white/60 text-xs mt-2.5 leading-relaxed bg-black/10 p-3 rounded-xl border border-white/5">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-12 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-white/20 mb-3"><path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375C2.754 3.75 2.25 4.254 2.25 4.875v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
                      <p className="text-white/40 text-sm font-semibold">No FAQs created yet.</p>
                    </div>
                  )}
                </>
              )}

              {/* 5. Products Tab */}
              {activeTab === "products" && (
                <>
                  <h2 className="font-heading font-extrabold text-xl border-b border-white/10 pb-3">
                    Manage Products ({initialProducts.length})
                  </h2>
                  {initialProducts.length > 0 ? (
                    <div className="space-y-4">
                      {initialProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#FF7A2F]/30 hover:bg-white/10 transition-all group"
                        >
                          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-slate-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-heading font-bold text-base truncate">
                                {prod.name}
                              </h3>
                              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                                prod.category === "Book"
                                  ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                  : "bg-sky-500/20 text-sky-300 border-sky-500/30"
                              }`}>
                                {prod.category}
                              </span>
                            </div>
                            <p className="text-white/60 text-xs truncate max-w-md mt-0.5">
                              {prod.description}
                            </p>
                            <div className="flex gap-4 mt-1.5 text-[10px] font-bold text-white/40">
                              <span className="text-[#FFD966]">Price: ₹{prod.price}</span>
                              <a href={prod.buyUrl} target="_blank" rel="noreferrer" className="text-[#FFB380] hover:underline truncate max-w-[150px] inline-flex items-center gap-1 select-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
                                <span>Buy Link</span>
                              </a>
                            </div>
                          </div>
                          
                          {/* Product Action triggers */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                setEditingProductId(prod.id);
                                setProductForm({
                                  name: prod.name,
                                  description: prod.description,
                                  price: prod.price.toString(),
                                  imageUrl: prod.imageUrl,
                                  buyUrl: prod.buyUrl,
                                  category: prod.category,
                                });
                                setProductImageFile(null);
                                const fileInput = document.getElementById("productImageFile") as HTMLInputElement;
                                if (fileInput) fileInput.value = "";
                              }}
                              className="p-2 rounded-lg border border-white/10 hover:border-amber-500/30 bg-white/5 hover:bg-amber-500/10 text-white/60 hover:text-amber-400 transition-all cursor-pointer"
                              title="Edit Product"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              disabled={isPending}
                              className="p-2 rounded-lg border border-white/10 hover:border-rose-500/30 bg-white/5 hover:bg-rose-500/10 text-white/60 hover:text-rose-400 transition-all cursor-pointer"
                              title="Delete Product"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-12 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-white/20 mb-3"><path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375C2.754 3.75 2.25 4.254 2.25 4.875v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
                      <p className="text-white/40 text-sm font-semibold">No products cataloged yet.</p>
                    </div>
                  )}
                </>
              )}

              {/* 6. Pricing Plans Tab */}
              {activeTab === "plans" && (
                <>
                  <h2 className="font-heading font-extrabold text-xl border-b border-white/10 pb-3">
                    Manage Pricing Plans ({initialPlans.length})
                  </h2>
                  {initialPlans.length > 0 ? (
                    <div className="space-y-4">
                      {initialPlans.map((plan) => (
                        <div
                          key={plan.id}
                          className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#FF7A2F]/30 hover:bg-white/10 transition-all group"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-heading font-bold text-base">
                                  {plan.name}
                                </h3>
                                {plan.isPopular && (
                                  <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm bg-[#FF7A2F]/20 text-[#FF7A2F] border border-[#FF7A2F]/30">
                                    Popular
                                  </span>
                                )}
                                {plan.badge && (
                                  <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm bg-violet-500/20 text-violet-300 border border-violet-500/30">
                                    {plan.badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-white/80 font-bold mt-1 text-sm">
                                {plan.price} <span className="text-white/40 font-normal text-xs">/ {plan.period}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  setEditingPlanId(plan.id);
                                  setPlanForm({
                                    name: plan.name,
                                    price: plan.price,
                                    period: plan.period,
                                    features: plan.features,
                                    isPopular: plan.isPopular,
                                    badge: plan.badge || "",
                                  });
                                }}
                                className="p-2 rounded-lg border border-white/10 hover:border-amber-500/30 bg-white/5 hover:bg-amber-500/10 text-white/60 hover:text-amber-400 transition-all cursor-pointer"
                                title="Edit Plan"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>
                              </button>
                              <button
                                onClick={() => handleDeletePlan(plan.id)}
                                disabled={isPending}
                                className="p-2 rounded-lg border border-white/10 hover:border-rose-500/30 bg-white/5 hover:bg-rose-500/10 text-white/60 hover:text-rose-400 transition-all cursor-pointer"
                                title="Delete Plan"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                              </button>
                            </div>
                          </div>
                          
                          <div className="mt-3 bg-black/10 p-3 rounded-xl border border-white/5 space-y-1">
                            <span className="text-[9px] uppercase font-bold text-white/30 tracking-wider block">Features:</span>
                            <ul className="text-white/60 text-xs list-disc list-inside space-y-0.5">
                              {plan.features.split(",").map((feat, i) => (
                                <li key={i}>{feat}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-12 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-white/20 mb-3"><path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375C2.754 3.75 2.25 4.254 2.25 4.875v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
                      <p className="text-white/40 text-sm font-semibold">No pricing plans created yet.</p>
                    </div>
                  )}
                </>
              )}

              {/* 7. Free Program Applications Tab */}
              {activeTab === "applications" && (
                <>
                  <h2 className="font-heading font-extrabold text-xl border-b border-white/10 pb-3">
                    Applications for Free Special Program ({initialApplications.length})
                  </h2>
                  {initialApplications.length > 0 ? (
                    <div className="space-y-4">
                      {initialApplications.map((app) => (
                        <div
                          key={app.id}
                          className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#FF7A2F]/30 hover:bg-white/10 transition-all group space-y-3"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h3 className="font-heading font-bold text-base leading-tight">
                                Child: {app.childName} <span className="text-white/40 font-normal font-body text-xs">({app.childAge} yrs old)</span>
                              </h3>
                              <span className="text-white/60 text-xs mt-1 block">
                                Parent: <span className="text-white font-semibold">{app.parentName}</span>
                              </span>
                              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-1.5 text-[10px] text-white/40 font-semibold font-mono">
                                <span className="flex items-center gap-1 select-none">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5 text-white/30"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                                  <span>{app.email}</span>
                                </span>
                                {app.phone && (
                                  <span className="flex items-center gap-1 select-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5 text-white/30"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.502-5.186-3.864-6.688-6.688l1.293-.97c.362-.272.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                                    <span>{app.phone}</span>
                                  </span>
                                )}
                                <span className="flex items-center gap-1 select-none">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5 text-white/30"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                                  <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                                app.status === "Approved"
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                  : app.status === "Rejected"
                                  ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                                  : "bg-orange-500/20 text-orange-300 border-orange-500/30"
                              }`}>
                                {app.status}
                              </span>
                              
                              <button
                                onClick={() => handleDeleteApplication(app.id)}
                                disabled={isPending}
                                className="p-1.5 rounded-lg border border-white/10 hover:border-rose-500/30 bg-white/5 hover:bg-rose-500/10 text-white/60 hover:text-rose-400 transition-all cursor-pointer"
                                title="Delete Application"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                              </button>
                            </div>
                          </div>

                          <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                            <span className="text-[9px] uppercase font-bold text-white/30 tracking-wider block mb-1">Application Reason:</span>
                            <p className="text-white/80 text-xs leading-relaxed whitespace-pre-wrap">{app.message}</p>
                          </div>

                          {/* Workflow Actions */}
                          {app.status === "Pending" && (
                            <div className="flex gap-2 justify-end pt-1">
                              <button
                                onClick={() => handleUpdateAppStatus(app.id, "Rejected")}
                                disabled={isPending}
                                className="px-3 py-1.5 rounded-lg border border-rose-500/30 hover:bg-rose-500/10 text-rose-300 text-xs font-bold transition-all cursor-pointer bg-transparent"
                              >
                                ✕ Reject
                              </button>
                              <button
                                onClick={() => handleUpdateAppStatus(app.id, "Approved")}
                                disabled={isPending}
                                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer border-none"
                              >
                                ✓ Approve
                              </button>
                            </div>
                          )}
                          {app.status !== "Pending" && (
                            <div className="flex justify-end pt-1">
                              <button
                                onClick={() => handleUpdateAppStatus(app.id, "Pending")}
                                disabled={isPending}
                                className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#FF7A2F] text-white/60 hover:text-[#FF7A2F] text-xs font-bold transition-all cursor-pointer bg-transparent inline-flex items-center gap-1.5"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                                <span>Reset to Pending</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-12 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-white/20 mb-3"><path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375C2.754 3.75 2.25 4.254 2.25 4.875v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
                      <p className="text-white/40 text-sm font-semibold">No applications received yet.</p>
                    </div>
                  )}
                </>
              )}

              {/* Programs Tab */}
              {activeTab === "programs" && (
                <>
                  <h2 className="font-heading font-extrabold text-xl border-b border-white/10 pb-3">
                    Programs & Events ({initialPrograms.length})
                  </h2>
                  {initialPrograms.length > 0 ? (
                    <div className="space-y-4 mt-4">
                      {initialPrograms.map((prog) => {
                        const isViewing = viewingRegistrationsFor === prog.id;
                        return (
                          <div key={prog.id} className="rounded-2xl bg-white/5 border border-white/5 hover:border-[#FF7A2F]/30 transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
                              <div className="min-w-0 flex items-center gap-3">
                                {prog.imageUrl ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={prog.imageUrl} alt={prog.title} className="w-14 h-12 rounded-lg object-cover shrink-0 border border-white/10" />
                                ) : (
                                  <div className="w-14 h-12 rounded-lg bg-[#FF7A2F]/10 border border-white/10 flex items-center justify-center shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-[#FF7A2F]/50"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <h3 className="font-heading font-bold text-sm truncate">{prog.title}</h3>
                                  <p className="text-white/40 text-[10px] mt-0.5">{prog.date} · {prog.location}</p>
                                  <p className="text-white/30 text-[10px]">{prog.registrations.length} registration(s)</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                                {/* Active toggle */}
                                <button
                                  onClick={() => handleToggleProgramActive(prog.id)}
                                  disabled={isPending}
                                  className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full border transition-all cursor-pointer disabled:opacity-50 ${prog.isActive ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-white/5 text-white/40 border-white/15 hover:bg-[#FF7A2F]/10 hover:text-[#FF7A2F]"}`}
                                >
                                  {prog.isActive ? "✓ Active" : "Inactive"}
                                </button>
                                {/* View Registrations */}
                                <button
                                  onClick={() => setViewingRegistrationsFor(isViewing ? null : prog.id)}
                                  className="p-2 rounded-lg border border-white/10 hover:border-blue-400/30 bg-white/5 hover:bg-blue-400/10 text-white/60 hover:text-blue-300 transition-all cursor-pointer"
                                  title="View Registrations"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
                                </button>
                                {/* Edit */}
                                <button
                                  onClick={() => {
                                    setEditingProgramId(prog.id);
                                    setProgramForm({
                                      title: prog.title,
                                      description: prog.description,
                                      date: prog.date,
                                      location: prog.location,
                                      imageUrl: prog.imageUrl || "",
                                      qrImageUrl: prog.qrImageUrl || "",
                                    });
                                    try { setProgramFormFields(JSON.parse(prog.formFields || "[]")); } catch { setProgramFormFields([]); }
                                  }}
                                  className="p-2 rounded-lg border border-white/10 hover:border-amber-500/30 bg-white/5 hover:bg-amber-500/10 text-white/60 hover:text-amber-400 transition-all cursor-pointer"
                                  title="Edit Program"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>
                                </button>
                                {/* Delete */}
                                <button
                                  onClick={() => handleDeleteProgram(prog.id)}
                                  disabled={isPending}
                                  className="p-2 rounded-lg border border-white/10 hover:border-rose-500/30 bg-white/5 hover:bg-rose-500/10 text-white/60 hover:text-rose-400 transition-all cursor-pointer disabled:opacity-30"
                                  title="Delete Program"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                                </button>
                              </div>
                            </div>

                            {/* Registrations sub-panel */}
                            {isViewing && (
                              <div className="border-t border-white/10 px-4 pb-4 space-y-3 mt-1">
                                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF7A2F] pt-3">
                                  Registrations ({prog.registrations.length})
                                </p>
                                {prog.registrations.length === 0 ? (
                                  <p className="text-white/30 text-xs">No registrations yet.</p>
                                ) : (
                                  prog.registrations.map((reg) => {
                                    let parsedResponses: Record<string, string> = {};
                                    try { parsedResponses = JSON.parse(reg.responses); } catch { parsedResponses = {}; }
                                    return (
                                      <div key={reg.id} className="rounded-xl bg-white/5 border border-white/5 p-3 space-y-2">
                                        <div className="flex items-center justify-between gap-2 flex-wrap">
                                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${reg.status === "Approved" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : reg.status === "Rejected" ? "bg-rose-500/20 text-rose-300 border-rose-500/30" : "bg-amber-500/20 text-amber-300 border-amber-500/30"}`}>
                                            {reg.status}
                                          </span>
                                          <span className="text-white/30 text-[9px]">{new Date(reg.createdAt).toLocaleDateString()}</span>
                                          <div className="flex gap-1.5 ml-auto">
                                            <button onClick={() => handleUpdateRegistrationStatus(reg.id, "Approved")} disabled={isPending} className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/25 cursor-pointer disabled:opacity-50 transition-all">Approve</button>
                                            <button onClick={() => handleUpdateRegistrationStatus(reg.id, "Rejected")} disabled={isPending} className="text-[9px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/25 cursor-pointer disabled:opacity-50 transition-all">Reject</button>
                                            <button onClick={() => handleDeleteRegistration(reg.id)} disabled={isPending} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10 hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer disabled:opacity-50 transition-all">Delete</button>
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                          {Object.entries(parsedResponses).map(([label, val]) => (
                                            <div key={label} className="min-w-0">
                                              <p className="text-[9px] text-white/30 uppercase tracking-wider">{label}</p>
                                              <p className="text-xs text-white/80 font-semibold truncate">{val || "—"}</p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center p-12 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-white/20 mb-3"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                      <p className="text-white/40 text-sm font-semibold">No programs created yet.</p>
                      <p className="text-white/20 text-xs mt-1">Create your first program using the form on the right.</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right Col form edit pane */}

            <div className="lg:col-span-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl space-y-4 lg:sticky lg:top-10">
              
              {/* Stories Form */}
              {activeTab === "stories" && (
                <>
                  <h3 className="font-heading font-extrabold text-lg border-b border-white/10 pb-3 flex items-center gap-2 select-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 text-[#FF7A2F]"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" /></svg>
                    <span>Create New Story</span>
                  </h3>
                  <form onSubmit={handleAddStory} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                        Story Title
                      </label>
                      <input
                        type="text"
                        required
                        value={storyForm.title}
                        onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30"
                        placeholder="e.g. The Sleeping Moon"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                        Short Description
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={storyForm.description}
                        onChange={(e) => setStoryForm({ ...storyForm, description: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30 resize-none"
                        placeholder="e.g. A lunar tale that guides kids to sleep..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                          Duration Text
                        </label>
                        <input
                          type="text"
                          required
                          value={storyForm.durationText}
                          onChange={(e) => setStoryForm({ ...storyForm, durationText: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30"
                          placeholder="e.g. 10 min"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                          Age Range
                        </label>
                        <input
                          type="text"
                          required
                          value={storyForm.ageRange}
                          onChange={(e) => setStoryForm({ ...storyForm, ageRange: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30"
                          placeholder="e.g. Ages 4–8"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                        Badge Highlight
                      </label>
                      <select
                        value={storyForm.badge}
                        onChange={(e) => setStoryForm({ ...storyForm, badge: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-[#2A1D5C] px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white"
                      >
                        <option value="">None</option>
                        <option value="New">New</option>
                        <option value="Popular">Popular</option>
                        <option value="Favorite">Favorite</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                        Illustration Image URL
                      </label>
                      <input
                        type="text"
                        required
                        value={storyForm.imageSrc}
                        onChange={(e) => setStoryForm({ ...storyForm, imageSrc: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                        Audio Source File URL
                      </label>
                      <input
                        type="text"
                        required
                        value={storyForm.audioSrc}
                        onChange={(e) => setStoryForm({ ...storyForm, audioSrc: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30 font-mono text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full py-3 bg-[#FF7A2F] hover:bg-[#E55A10] disabled:bg-white/10 disabled:text-white/30 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer border-none mt-2 select-none"
                    >
                      {isPending ? "Creating..." : "Add Story"}
                    </button>
                  </form>
                </>
              )}

              {/* Testimonials Form */}
              {activeTab === "testimonials" && (
                <>
                  <h3 className="font-heading font-extrabold text-lg border-b border-white/10 pb-3 flex items-center gap-2 select-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 text-[#FF7A2F]"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.5c1.153-.086 2.294-.213 3.423-.379 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v5.772Z" /></svg>
                    <span>Add Testimonial</span>
                  </h3>
                  <form onSubmit={handleAddTestimonial} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                        Parent/Author Name
                      </label>
                      <input
                        type="text"
                        required
                        value={testimonialForm.authorName}
                        onChange={(e) =>
                          setTestimonialForm({ ...testimonialForm, authorName: e.target.value })
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30"
                        placeholder="e.g. Sarah Mitchell"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                        Author Role / Age Tags
                      </label>
                      <input
                        type="text"
                        required
                        value={testimonialForm.authorRole}
                        onChange={(e) =>
                          setTestimonialForm({ ...testimonialForm, authorRole: e.target.value })
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30"
                        placeholder="e.g. Mom of 2 · Ages 4 & 7"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                        Review Text
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={testimonialForm.text}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, text: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30 resize-none leading-relaxed"
                        placeholder="e.g. LALA Kids has completely transformed bedtime..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full py-3 bg-[#FF7A2F] hover:bg-[#E55A10] disabled:bg-white/10 disabled:text-white/30 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer border-none mt-2 select-none"
                    >
                      {isPending ? "Submitting..." : "Add Testimonial"}
                    </button>
                  </form>
                </>
              )}

              {/* FAQs Form */}
              {activeTab === "faqs" && (
                <>
                  <h3 className="font-heading font-extrabold text-lg border-b border-white/10 pb-3 flex items-center gap-2 select-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 text-[#FF7A2F]"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>
                    <span>Add FAQ Item</span>
                  </h3>
                  <form onSubmit={handleAddFaq} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                        FAQ Question
                      </label>
                      <input
                        type="text"
                        required
                        value={faqForm.question}
                        onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30"
                        placeholder="e.g. Is LALA Stories free to try?"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                        FAQ Answer
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={faqForm.answer}
                        onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30 resize-none leading-relaxed"
                        placeholder="e.g. Yes! We offer a free nightly selection..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full py-3 bg-[#FF7A2F] hover:bg-[#E55A10] disabled:bg-white/10 disabled:text-white/30 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer border-none mt-2 select-none"
                    >
                      {isPending ? "Creating..." : "Add FAQ"}
                    </button>
                  </form>
                </>
              )}

              {/* Products CRUD Form */}
              {activeTab === "products" && (
                <>
                  <h3 className="font-heading font-extrabold text-lg border-b border-white/10 pb-3 flex items-center gap-2 select-none">
                    {editingProductId ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 text-[#FF7A2F]"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 text-[#FF7A2F]"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12a1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
                    )}
                    <span>{editingProductId ? "Edit Product" : "Add New Product"}</span>
                  </h3>
                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30"
                        placeholder="e.g. LALA Bedtime Storybook"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                          Category
                        </label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-[#2A1D5C] px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white"
                        >
                          <option value="Book">Book</option>
                          <option value="Toy">Toy</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30"
                          placeholder="e.g. 299"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                        Description
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30 resize-none"
                        placeholder="Short marketing description..."
                      />
                    </div>

                    {/* Image Preview Container */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50">
                        Image Preview
                      </label>
                      <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-black/30 border border-white/10 flex items-center justify-center">
                        {productImageFile ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={URL.createObjectURL(productImageFile)}
                            alt="Upload preview"
                            className="w-full h-full object-cover"
                          />
                        ) : productForm.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={productForm.imageUrl}
                            alt="Current image"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-white/30 text-xs flex flex-col items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
                            <span>No image selected</span>
                          </div>
                        )}
                        
                        {productImageFile && (
                          <button
                            type="button"
                            onClick={() => {
                              setProductImageFile(null);
                              const fileInput = document.getElementById("productImageFile") as HTMLInputElement;
                              if (fileInput) fileInput.value = "";
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white/80 hover:text-white transition-all border border-white/10"
                            title="Remove selected image"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* File Upload Input Option */}
                    <div className="space-y-1 bg-white/5 p-4 rounded-xl border border-white/5">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50">
                        Upload Product Image Cover
                      </label>
                      <input
                        type="file"
                        id="productImageFile"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setProductImageFile(e.target.files[0]);
                          }
                        }}
                        className="w-full text-xs text-white/60 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#FF7A2F]/10 file:text-[#FF7A2F] hover:file:bg-[#FF7A2F]/20 file:cursor-pointer mt-1"
                      />
                      <span className="text-[9px] text-white/40 block mt-1">Accepts PNG, JPG, JPEG. Overrides text URL if selected.</span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                        Or Image URL path (Fallback)
                      </label>
                      <input
                        type="text"
                        value={productForm.imageUrl}
                        onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30 font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                        Buy URL (Amazon / Shop link)
                      </label>
                      <input
                        type="text"
                        required
                        value={productForm.buyUrl}
                        onChange={(e) => setProductForm({ ...productForm, buyUrl: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30 font-mono text-xs"
                      />
                    </div>

                    <div className="flex gap-3 mt-2">
                      {editingProductId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProductId(null);
                            setProductForm({
                              name: "",
                              description: "",
                              price: "",
                              imageUrl: "/assets/images/letter_garden.jpg",
                              buyUrl: "https://amazon.in",
                              category: "Book",
                            });
                            setProductImageFile(null);
                            const fileInput = document.getElementById("productImageFile") as HTMLInputElement;
                            if (fileInput) fileInput.value = "";
                          }}
                          className="w-1/3 py-3.5 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer select-none"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={isPending}
                        className={`${editingProductId ? "w-2/3" : "w-full"} py-3.5 bg-[#FF7A2F] hover:bg-[#E55A10] disabled:bg-white/10 disabled:text-white/30 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer border-none select-none`}
                      >
                        {isPending ? "Saving..." : editingProductId ? "Update Product" : "Add Product"}
                      </button>
                    </div>
                  </form>
                </>
              )}

              {/* Pricing Plans Form */}
              {activeTab === "plans" && (
                <>
                  <h3 className="font-heading font-extrabold text-lg border-b border-white/10 pb-3 flex items-center gap-2 select-none">
                    {editingPlanId ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 text-[#FF7A2F]"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 text-[#FF7A2F]"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
                    )}
                    <span>{editingPlanId ? "Edit Pricing Plan" : "Add Pricing Plan"}</span>
                  </h3>
                  <form onSubmit={handleSavePlan} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                        Plan Name
                      </label>
                      <input
                        type="text"
                        required
                        value={planForm.name}
                        onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30"
                        placeholder="e.g. Premium Yearly"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                          Price Display
                        </label>
                        <input
                          type="text"
                          required
                          value={planForm.price}
                          onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30"
                          placeholder="e.g. ₹1,999"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                          Billing Period
                        </label>
                        <select
                          value={planForm.period}
                          onChange={(e) => setPlanForm({ ...planForm, period: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-[#2A1D5C] px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white"
                        >
                          <option value="month">month</option>
                          <option value="year">year</option>
                          <option value="one-time">one-time</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                        Highlight Badge
                      </label>
                      <input
                        type="text"
                        value={planForm.badge}
                        onChange={(e) => setPlanForm({ ...planForm, badge: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30"
                        placeholder="e.g. Save 40%, Best Value"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                        Features List (Comma-separated)
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={planForm.features}
                        onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30 resize-none leading-relaxed"
                        placeholder="e.g. 3000+ Bedtime Audio Stories,Offline downloads,Sleep timer"
                      />
                      <span className="text-[10px] text-white/40 block mt-1">Separate each benefit feature with a comma (`,`).</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                      <input
                        type="checkbox"
                        id="isPopular"
                        checked={planForm.isPopular}
                        onChange={(e) => setPlanForm({ ...planForm, isPopular: e.target.checked })}
                        className="w-4 h-4 rounded-sm border-white/20 accent-[#FF7A2F]"
                      />
                      <label htmlFor="isPopular" className="text-xs font-bold text-white select-none cursor-pointer">
                        Mark this pricing plan as "Popular" (highlights card)
                      </label>
                    </div>
                    <div className="flex gap-3 mt-2">
                      {editingPlanId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPlanId(null);
                            setPlanForm({
                              name: "",
                              price: "",
                              period: "month",
                              features: "",
                              isPopular: false,
                              badge: "",
                            });
                          }}
                          className="w-1/3 py-3 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer select-none"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={isPending}
                        className={`${editingPlanId ? "w-2/3" : "w-full"} py-3 bg-[#FF7A2F] hover:bg-[#E55A10] disabled:bg-white/10 disabled:text-white/30 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer border-none select-none`}
                      >
                        {isPending ? "Saving..." : editingPlanId ? "Update Plan" : "Add Pricing Plan"}
                      </button>
                    </div>
                  </form>
                </>
              )}

              {/* Applications Explainer */}
              {activeTab === "applications" && (
                <div className="space-y-4">
                  <h3 className="font-heading font-extrabold text-lg border-b border-white/10 pb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4.5 h-4.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 1 1 1.085 1.086L12 12.75l-1.424-.434a.75.75 0 1 1 .552-1.396l.041.02zM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    <span>Application Tracker</span>
                  </h3>
                  <p className="text-white/60 text-xs leading-relaxed">
                    Parents of kids with special needs can apply for free premium app credentials via the website's `/differently-abled` application form.
                  </p>
                  <div className="p-4 bg-[#FF7A2F]/10 border border-[#FF7A2F]/20 rounded-2xl space-y-2 text-xs">
                    <span className="font-bold text-[#FF7A2F] block">Approval workflow:</span>
                    <p className="text-white/80 font-medium leading-relaxed">
                      Review each application detail. Once verified, change the status to "Approved". You will need to manually generate app access codes inside your mobile platform.
                    </p>
                  </div>
                </div>
              )}

              {/* Programs & Events Form */}
              {activeTab === "programs" && (
                <>
                  <h3 className="font-heading font-extrabold text-lg border-b border-white/10 pb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4.5 h-4.5 text-[#FF7A2F]"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                    <span>{editingProgramId ? "Edit Program" : "Create New Program"}</span>
                  </h3>
                  <form onSubmit={handleSaveProgram} className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">Program Title *</label>
                      <input type="text" required value={programForm.title}
                        onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30"
                        placeholder="e.g. Story Telling Program" />
                    </div>
                    {/* Description */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">Description *</label>
                      <textarea required rows={3} value={programForm.description}
                        onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30 resize-none"
                        placeholder="Short description of the program..." />
                    </div>
                    {/* Date & Location */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">Date *</label>
                        <input type="text" required value={programForm.date}
                          onChange={(e) => setProgramForm({ ...programForm, date: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30"
                          placeholder="e.g. June 22, 2025" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">Location *</label>
                        <input type="text" required value={programForm.location}
                          onChange={(e) => setProgramForm({ ...programForm, location: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30"
                          placeholder="e.g. Kochi, Kerala" />
                      </div>
                    </div>
                    {/* Banner Image */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">Banner / Poster Image</label>
                      <input id="programBannerFile" type="file" accept="image/*"
                        onChange={(e) => { if (e.target.files?.[0]) setProgramBannerFile(e.target.files[0]); }}
                        className="w-full text-xs text-white/50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#FF7A2F]/20 file:text-[#FF7A2F] hover:file:bg-[#FF7A2F]/30 cursor-pointer" />
                      {programForm.imageUrl && (
                        <p className="text-[9px] text-white/30 mt-1 truncate">Current: {programForm.imageUrl}</p>
                      )}
                    </div>
                    {/* QR Image */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">QR Code Image (shown after registration)</label>
                      <input id="programQrFile" type="file" accept="image/*"
                        onChange={(e) => { if (e.target.files?.[0]) setProgramQrFile(e.target.files[0]); }}
                        className="w-full text-xs text-white/50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-violet-500/20 file:text-violet-300 hover:file:bg-violet-500/30 cursor-pointer" />
                      {programForm.qrImageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={programForm.qrImageUrl} alt="QR Preview" className="mt-2 w-20 h-20 object-contain rounded-lg border border-white/10" />
                      )}
                    </div>

                    {/* Dynamic Form Fields Builder */}
                    <div className="space-y-3 pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF7A2F]">
                          Registration Form Fields ({programFormFields.length})
                        </p>
                        <button type="button" onClick={addFormField}
                          className="text-[9px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-[#FF7A2F]/15 text-[#FF7A2F] border border-[#FF7A2F]/30 hover:bg-[#FF7A2F]/25 cursor-pointer transition-all flex items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                          Add Field
                        </button>
                      </div>
                      {programFormFields.length === 0 && (
                        <p className="text-white/30 text-xs italic">No fields yet — add fields to build your registration form.</p>
                      )}
                      {programFormFields.map((field, idx) => (
                        <div key={field.id} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-extrabold uppercase text-white/30">Field {idx + 1}</span>
                            <button type="button" onClick={() => removeFormField(field.id)}
                              className="text-[9px] text-rose-400/70 hover:text-rose-400 cursor-pointer transition-all font-bold">✕ Remove</button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9px] text-white/40 uppercase tracking-wider block mb-1">Label</label>
                              <input type="text" required value={field.label}
                                onChange={(e) => updateFormField(field.id, { label: e.target.value })}
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white focus:border-[#FF7A2F] focus:outline-hidden transition-all"
                                placeholder="e.g. Child Name" />
                            </div>
                            <div>
                              <label className="text-[9px] text-white/40 uppercase tracking-wider block mb-1">Type</label>
                              <select value={field.type}
                                onChange={(e) => updateFormField(field.id, { type: e.target.value as FormField["type"] })}
                                className="w-full rounded-lg border border-white/10 bg-[#0F0826] px-3 py-1.5 text-xs text-white focus:border-[#FF7A2F] focus:outline-hidden transition-all">
                                <option value="text">Text</option>
                                <option value="email">Email</option>
                                <option value="tel">Phone</option>
                                <option value="number">Number</option>
                                <option value="textarea">Long Text</option>
                                <option value="select">Dropdown</option>
                              </select>
                            </div>
                          </div>
                          {field.type === "select" && (
                            <div>
                              <label className="text-[9px] text-white/40 uppercase tracking-wider block mb-1">Options (comma-separated)</label>
                              <input type="text" value={field.options || ""}
                                onChange={(e) => updateFormField(field.id, { options: e.target.value })}
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white focus:border-[#FF7A2F] focus:outline-hidden transition-all"
                                placeholder="Option 1, Option 2, Option 3" />
                            </div>
                          )}
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" checked={field.required}
                              onChange={(e) => updateFormField(field.id, { required: e.target.checked })}
                              className="accent-[#FF7A2F] w-3.5 h-3.5" />
                            <span className="text-[10px] text-white/60 font-semibold">Required field</span>
                          </label>
                        </div>
                      ))}
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 pt-2">
                      <button type="submit" disabled={isPending}
                        className="flex-1 bg-[#FF7A2F] hover:bg-[#E55A10] disabled:opacity-60 text-white font-heading font-bold py-3 rounded-2xl transition-all text-sm flex items-center justify-center gap-2">
                        {isPending ? (
                          <><svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving...</>
                        ) : editingProgramId ? "Update Program" : "Create Program"}
                      </button>
                      {editingProgramId && (
                        <button type="button" onClick={resetProgramForm}
                          className="px-4 py-3 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-bold transition-all cursor-pointer">
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </>
              )}

              {/* Video Explainer */}
              {/* Background Video Form */}

              {activeTab === "video" && (
                <>
                  <h3 className="font-heading font-extrabold text-lg border-b border-white/10 pb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4.5 h-4.5 text-[#FF7A2F]"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                    <span>{editingBgVideoId ? "Edit Video Details" : "Add Background Video"}</span>
                  </h3>
                  <form onSubmit={handleSaveBgVideo} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                        Video Name / Label
                      </label>
                      <input
                        type="text"
                        required
                        value={bgVideoForm.title}
                        onChange={(e) => setBgVideoForm({ ...bgVideoForm, title: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30"
                        placeholder="e.g. Dreamy Sparkles Loop"
                      />
                    </div>

                    {/* Upload option */}
                    <div className="space-y-1 bg-white/5 p-4 rounded-xl border border-white/5">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50">
                        Upload Video Loop (.mp4)
                      </label>
                      <input
                        type="file"
                        id="bgVideoFile"
                        accept="video/mp4"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setBgVideoFile(e.target.files[0]);
                          }
                        }}
                        className="w-full text-xs text-white/60 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#FF7A2F]/10 file:text-[#FF7A2F] hover:file:bg-[#FF7A2F]/20 file:cursor-pointer mt-1"
                      />
                      <span className="text-[9px] text-white/40 block mt-1">Select an MP4 file. Overrides text path if selected.</span>
                    </div>

                    {/* Fallback URL text input */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                        Or Video URL path (Fallback)
                      </label>
                      <input
                        type="text"
                        value={bgVideoForm.videoUrl}
                        onChange={(e) => setBgVideoForm({ ...bgVideoForm, videoUrl: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all text-white placeholder-white/30 font-mono text-xs"
                        placeholder="e.g. /assets/video/hero_bg.mp4"
                      />
                    </div>

                    {/* Preview Player in Form */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50">
                        Form Preview
                      </label>
                      <div className="relative w-full h-36 rounded-xl overflow-hidden bg-black/30 border border-white/10 flex items-center justify-center">
                        {bgVideoFile ? (
                          <video
                            src={URL.createObjectURL(bgVideoFile)}
                            controls
                            muted
                            className="w-full h-full object-cover"
                          />
                        ) : bgVideoForm.videoUrl ? (
                          <video
                            src={bgVideoForm.videoUrl}
                            controls
                            muted
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-white/30 text-xs flex flex-col items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                            <span>No video selected</span>
                          </div>
                        )}

                        {bgVideoFile && (
                          <button
                            type="button"
                            onClick={() => {
                              setBgVideoFile(null);
                              const fileInput = document.getElementById("bgVideoFile") as HTMLInputElement;
                              if (fileInput) fileInput.value = "";
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white/80 hover:text-white transition-all border border-white/10"
                            title="Remove selected video"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      {editingBgVideoId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBgVideoId(null);
                            setBgVideoForm({ title: "", videoUrl: "" });
                            setBgVideoFile(null);
                            const fileInput = document.getElementById("bgVideoFile") as HTMLInputElement;
                            if (fileInput) fileInput.value = "";
                          }}
                          className="w-1/3 py-3 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer select-none"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={isPending}
                        className={`${editingBgVideoId ? "w-2/3" : "w-full"} py-3.5 bg-[#FF7A2F] hover:bg-[#E55A10] disabled:bg-white/10 disabled:text-white/30 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer border-none select-none`}
                      >
                        {isPending ? "Saving..." : editingBgVideoId ? "Update Video" : "Add Video"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* ====== USERS & PERMISSIONS TAB ====== */}
            {activeTab === "users" && (
              <div className="lg:col-span-12 space-y-8">
                {/* Users table */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                  <h2 className="font-heading font-extrabold text-xl border-b border-white/10 pb-3">
                    Admin Users ({admins.length})
                  </h2>
                  {admins.length === 0 ? (
                    <p className="text-white/40 text-sm py-4 text-center">No admin users found.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-[10px] font-extrabold uppercase tracking-widest text-white/40 border-b border-white/10">
                            <th className="pb-3 pr-4">Name / Username</th>
                            <th className="pb-3 pr-4">Email</th>
                            <th className="pb-3 pr-4">Role</th>
                            <th className="pb-3 pr-4">Added</th>
                            <th className="pb-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {admins.map((admin) => (
                            <tr key={admin.id} className="hover:bg-white/5 transition-colors group">
                              <td className="py-3.5 pr-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF7A2F] to-[#E55A10] flex items-center justify-center text-xs font-bold text-white shrink-0">
                                    {(admin.name || admin.username).charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-white text-sm leading-tight">
                                      {admin.name || "—"}
                                      {admin.username === currentUsername && (
                                        <span className="ml-1.5 text-[9px] font-bold uppercase tracking-wider text-[#FF7A2F] bg-[#FF7A2F]/15 px-1.5 py-0.5 rounded-full">You</span>
                                      )}
                                    </div>
                                    <div className="text-white/40 text-xs">@{admin.username}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 pr-4 text-white/60 text-xs">{admin.email || "—"}</td>
                              <td className="py-3.5 pr-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  admin.role === "superadmin"
                                    ? "bg-[#FF7A2F]/20 text-[#FF7A2F]"
                                    : admin.role === "editor"
                                    ? "bg-blue-500/20 text-blue-300"
                                    : "bg-white/10 text-white/50"
                                }`}>
                                  {admin.role === "superadmin" ? "Super Admin" : admin.role === "editor" ? "Editor" : "Viewer"}
                                </span>
                              </td>
                              <td className="py-3.5 pr-4 text-white/40 text-xs">
                                {new Date(admin.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </td>
                              <td className="py-3.5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingAdminId(admin.id);
                                      setAdminForm({
                                        username: admin.username,
                                        name: admin.name,
                                        email: admin.email,
                                        password: "",
                                        role: admin.role,
                                      });
                                    }}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-[#FF7A2F]/20 hover:text-[#FF7A2F] text-white/60 transition-all border-none cursor-pointer"
                                    title="Edit user"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                                  </button>
                                  {admin.username !== currentUsername && (
                                    <button
                                      onClick={() => handleDeleteAdmin(admin.id)}
                                      disabled={isPending}
                                      className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-white/60 transition-all border-none cursor-pointer disabled:opacity-40"
                                      title="Delete user"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Add / Edit User Form */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl space-y-5">
                  <h2 className="font-heading font-extrabold text-xl border-b border-white/10 pb-3">
                    {editingAdminId ? "Edit User" : "Add New User"}
                  </h2>
                  <form onSubmit={handleSaveAdmin} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Username — only shown for new users */}
                      {!editingAdminId && (
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-white/50">Username *</label>
                          <input
                            type="text"
                            value={adminForm.username}
                            onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
                            required
                            placeholder="e.g. editor_jane"
                            className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-none transition-all text-white placeholder-white/30"
                          />
                        </div>
                      )}
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-extrabold uppercase tracking-widest text-white/50">Full Name</label>
                        <input
                          type="text"
                          value={adminForm.name}
                          onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                          placeholder="e.g. Jane Doe"
                          className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-none transition-all text-white placeholder-white/30"
                        />
                      </div>
                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-extrabold uppercase tracking-widest text-white/50">Email</label>
                        <input
                          type="email"
                          value={adminForm.email}
                          onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                          placeholder="e.g. jane@example.com"
                          className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-none transition-all text-white placeholder-white/30"
                        />
                      </div>
                      {/* Password */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-extrabold uppercase tracking-widest text-white/50">
                          Password {editingAdminId && <span className="text-white/30 normal-case font-normal">(leave blank to keep current)</span>}
                        </label>
                        <input
                          type="password"
                          value={adminForm.password}
                          onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                          required={!editingAdminId}
                          placeholder="••••••••"
                          className="w-full rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-none transition-all text-white placeholder-white/30"
                        />
                      </div>
                      {/* Role */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-extrabold uppercase tracking-widest text-white/50">Role *</label>
                        <select
                          value={adminForm.role}
                          onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-[#1A1040] focus:bg-white/10 px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-none transition-all text-white"
                        >
                          <option value="superadmin">Super Admin — Full access</option>
                          <option value="editor">Editor — Can manage content</option>
                          <option value="viewer">Viewer — Read-only access</option>
                        </select>
                      </div>
                    </div>

                    {/* Role description hint */}
                    <div className={`p-3 rounded-xl text-xs font-medium flex items-start gap-2 ${
                      adminForm.role === "superadmin" ? "bg-[#FF7A2F]/10 text-[#FF7A2F]/80 border border-[#FF7A2F]/20"
                      : adminForm.role === "editor" ? "bg-blue-500/10 text-blue-300/80 border border-blue-500/20"
                      : "bg-white/5 text-white/40 border border-white/10"
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5 shrink-0 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>
                      {adminForm.role === "superadmin"
                        ? "Super Admin has full access to all sections of the admin panel including user management."
                        : adminForm.role === "editor"
                        ? "Editor can create, edit, and delete content (stories, FAQs, products, programs) but cannot manage users."
                        : "Viewer has read-only access and cannot make any changes."}
                    </div>

                    <div className="flex gap-3 pt-2">
                      {editingAdminId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAdminId(null);
                            setAdminForm({ username: "", name: "", email: "", password: "", role: "editor" });
                          }}
                          className="w-1/3 py-3 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer select-none"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={isPending}
                        className={`${editingAdminId ? "w-2/3" : "w-full"} py-3.5 bg-[#FF7A2F] hover:bg-[#E55A10] disabled:bg-white/10 disabled:text-white/30 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer border-none select-none`}
                      >
                        {isPending ? "Saving..." : editingAdminId ? "Update User" : "Add User"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
