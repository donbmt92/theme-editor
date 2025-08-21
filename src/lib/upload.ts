import { writeFile, mkdir, access, constants } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// Cấu hình upload thông minh cho cả dev và production
export const UPLOAD_CONFIG = {
  // Tự động detect môi trường
  UPLOAD_DIR:
    process.env.NODE_ENV === "production"
      ? "/var/www/onghoangdohieu/uploads" // Production VPS
      : join(process.cwd(), "public", "uploads"), // Development local
  MAX_FILE_SIZE: 20 * 1024 * 1024, // 20MB
  ALLOWED_TYPES: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
  ],
  MAX_FILES_PER_REQUEST: 1,
};

export interface UploadResult {
  success: boolean;
  url?: string;
  fileName?: string;
  size?: number;
  type?: string;
  error?: string;
}

/**
 * Check if upload directory is writable
 */
async function checkUploadDirectory(): Promise<{
  exists: boolean;
  writable: boolean;
  error?: string;
}> {
  try {
    const exists = existsSync(UPLOAD_CONFIG.UPLOAD_DIR);
    if (!exists) {
      return {
        exists: false,
        writable: false,
        error: "Upload directory does not exist",
      };
    }

    await access(UPLOAD_CONFIG.UPLOAD_DIR, constants.W_OK);
    return { exists: true, writable: true };
  } catch (error) {
    return {
      exists: true,
      writable: false,
      error: `Upload directory is not writable: ${error}`,
    };
  }
}

/**
 * Validate file upload
 */
export function validateFile(file: File): { isValid: boolean; error?: string } {
  console.log("Validating file:", {
    type: file.type,
    size: file.size,
    allowedTypes: UPLOAD_CONFIG.ALLOWED_TYPES,
    uploadDir: UPLOAD_CONFIG.UPLOAD_DIR,
    environment: process.env.NODE_ENV,
  });

  // Check file type
  if (!UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    console.log("Invalid file type:", file.type);
    return {
      isValid: false,
      error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed",
    };
  }

  // Check file size
  if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
    console.log("File too large:", file.size, ">", UPLOAD_CONFIG.MAX_FILE_SIZE);
    return {
      isValid: false,
      error: `File size too large. Maximum size is ${
        UPLOAD_CONFIG.MAX_FILE_SIZE / (1024 * 1024)
      }MB`,
    };
  }

  console.log("File validation passed");
  return { isValid: true };
}

/**
 * Generate unique filename
 */
export function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExtension = originalName.split(".").pop() || "jpg";
  const fileName = `${timestamp}-${randomString}.${fileExtension}`;
  console.log("Generated filename:", fileName);
  return fileName;
}

/**
 * Upload file to server
 */
export async function uploadFile(file: File): Promise<UploadResult> {
  console.log("Starting upload process...", {
    environment: process.env.NODE_ENV,
    uploadDir: UPLOAD_CONFIG.UPLOAD_DIR,
  });

  try {
    // Check upload directory
    console.log("Checking upload directory...");
    const dirCheck = await checkUploadDirectory();
    if (!dirCheck.exists || !dirCheck.writable) {
      console.log("Directory check failed:", dirCheck.error);
      return {
        success: false,
        error: dirCheck.error || "Upload directory is not accessible",
      };
    }

    // Validate file
    console.log("Validating file...");
    const validation = validateFile(file);
    if (!validation.isValid) {
      console.log("File validation failed:", validation.error);
      return {
        success: false,
        error: validation.error,
      };
    }

    // Create upload directory if it doesn't exist
    console.log("Checking upload directory:", UPLOAD_CONFIG.UPLOAD_DIR);
    if (!existsSync(UPLOAD_CONFIG.UPLOAD_DIR)) {
      console.log("Creating upload directory...");
      await mkdir(UPLOAD_CONFIG.UPLOAD_DIR, { recursive: true });
      console.log("Upload directory created");
    } else {
      console.log("Upload directory exists");
    }

    // Generate unique filename
    const fileName = generateFileName(file.name);
    const filePath = join(UPLOAD_CONFIG.UPLOAD_DIR, fileName);
    console.log("File path:", filePath);

    // Convert file to buffer
    console.log("Converting file to buffer...");
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log("Buffer created, size:", buffer.length);

    // Save file
    console.log("Writing file to disk...");
    await writeFile(filePath, buffer);
    console.log("File written successfully");

    // Return success result with environment-aware URL
    const result = {
      success: true,
      url:
        process.env.NODE_ENV === "production"
          ? `/uploads/${fileName}` // Production: relative URL
          : `/uploads/${fileName}`, // Development: relative URL
      fileName: fileName,
      size: file.size,
      type: file.type,
    };
    console.log("Upload result:", result);
    return result;
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: `Internal server error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

/**
 * Delete uploaded file
 */
export async function deleteFile(
  fileName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { unlink } = await import("fs/promises");
    const filePath = join(UPLOAD_CONFIG.UPLOAD_DIR, fileName);

    if (existsSync(filePath)) {
      await unlink(filePath);
      return { success: true };
    } else {
      return { success: false, error: "File not found" };
    }
  } catch (error) {
    console.error("Delete file error:", error);
    return {
      success: false,
      error: "Failed to delete file",
    };
  }
}
