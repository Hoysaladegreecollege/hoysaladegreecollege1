import jsPDF from "jspdf";
import collegeLogo from "@/assets/college-logo.png";
import saiBabaImg from "@/assets/sai-baba.png";

interface StudentData {
  fullName: string;
  fatherName: string;
  courseName: string;
  semester: number;
  rollNumber: string;
  gender: string;
  aadhaarNumber: string;
  dateOfBirth: string;
  nationality: string;
  caste: string;
  category: string;
  academicYear: string;
}

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export async function generateStudyCertificate(data: StudentData) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Draw border
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.rect(10, 10, 190, 277);
  doc.setLineWidth(0.3);
  doc.rect(11, 11, 188, 275);

  // Load images
  try {
    const [logoImg, saiImg] = await Promise.all([
      loadImage(collegeLogo),
      loadImage(saiBabaImg),
    ]);
    doc.addImage(logoImg, "PNG", 15, 14, 28, 28);
    doc.addImage(saiImg, "PNG", 167, 14, 28, 28);
  } catch (e) {
    console.warn("Could not load images for certificate:", e);
  }

  // Header text
  let y = 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 180);
  doc.text("Sri Shiradi Sai Educational Trust ®", pageWidth / 2, y, { align: "center" });

  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text("HOYSALA DEGREE COLLEGE", pageWidth / 2, y, { align: "center" });

  // Underline
  const titleWidth = doc.getTextWidth("HOYSALA DEGREE COLLEGE");
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - titleWidth / 2, y + 1, pageWidth / 2 + titleWidth / 2, y + 1);

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("KRP Arcade, Paramannn Layout, Nelamangala, Bangalore Rural Dist. - 562123", pageWidth / 2, y, { align: "center" });

  y += 4;
  doc.text("Recognized by Govt. of Karnataka", pageWidth / 2, y, { align: "center" });

  y += 4;
  doc.text("Affiliated to Bangalore University & Approved By AICTE, New Delhi", pageWidth / 2, y, { align: "center" });

  y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("College Code: BU - 26 (P21GEF0099)", pageWidth / 2, y, { align: "center" });

  // Horizontal line
  y += 5;
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);

  // Study Certificate Title
  y += 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text("STUDY CERTIFICATE", pageWidth / 2, y, { align: "center" });
  const scWidth = doc.getTextWidth("STUDY CERTIFICATE");
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - scWidth / 2, y + 1.5, pageWidth / 2 + scWidth / 2, y + 1.5);

  // Gender prefix
  const genderPrefix = data.gender?.toLowerCase() === "male" ? "Kr" : 
                        data.gender?.toLowerCase() === "female" ? "Kum" : "Kr/Kum";
  
  // D/O or S/O
  const relation = data.gender?.toLowerCase() === "male" ? "S/O" : "D/O";

  // Certificate body text
  y += 16;
  doc.setFont("times", "normal");
  doc.setFontSize(13);
  doc.setTextColor(0);

  const bodyText = `This is to certify that ${genderPrefix}. ${data.fullName.toUpperCase()} ${relation} ${data.fatherName || "________"} is a student of this college in ${data.courseName || "________"} ${data.semester ? `Sem ${data.semester}` : "________"} bearing Admission No: (Reg.No: ${data.rollNumber || "________"}) during the academic year ${data.academicYear}.`;

  const lines = doc.splitTextToSize(bodyText, contentWidth - 10);
  doc.text(lines, margin + 5, y, { lineHeightFactor: 1.8 });

  // Student details section
  y += lines.length * 9 + 15;

  doc.setFont("times", "normal");
  doc.setFontSize(12);

  const details = [
    { label: "Aadhar No:", value: data.aadhaarNumber || "________________" },
    { label: "Date of Birth:", value: data.dateOfBirth || "________________" },
    { label: "Nationality:", value: data.nationality || "________________" },
    { label: "Caste:", value: data.caste || "________________" },
    { label: "Group:", value: data.category || "________________" },
  ];

  for (const d of details) {
    doc.setFont("times", "bold");
    doc.text(`${d.label}`, margin + 5, y);
    doc.setFont("times", "normal");
    doc.text(`${d.value}`, margin + 40, y);
    y += 8;
  }

  // Disclaimer
  y += 10;
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.setTextColor(180, 0, 0);
  doc.text("This Certificate issued according to records of our Institution.", margin + 10, y);

  // Signature area
  y = 250;
  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("Date: _______________", margin + 5, y);
  doc.text("Principal", pageWidth - margin - 25, y, { align: "center" });
  doc.text("Hoysala Degree College", pageWidth - margin - 25, y + 5, { align: "center" });

  // Save the PDF
  doc.save(`Study_Certificate_${data.fullName.replace(/\s+/g, "_")}.pdf`);
}
