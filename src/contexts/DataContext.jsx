import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const DataContext = createContext();
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);

  // Fetch all classes
  const fetchClasses = async () => {
    console.log("Fetching classes...");
    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .order("id");

    if (error) {
      console.error("Error fetching classes:", error);
    } else {
      console.log("Classes fetched:", data);
      setClasses(data);
    }
  };

  // Fetch all students
  const fetchStudents = async () => {
    console.log("Fetching students...");
    const { data, error } = await supabase.from("students").select("*");
    if (error) {
      console.error("Error fetching students:", error);
    } else {
      console.log("Students fetched:", data);
      setStudents(data);
    }
  };

  // Fetch all attendance records
  const fetchAttendance = async () => {
    console.log("Fetching attendance...");
    const { data, error } = await supabase.from("attendance").select("*");
    if (error) {
      console.error("Error fetching attendance:", error);
    } else {
      console.log("Attendance fetched:", data);
      setAttendance(data);
    }
  };

  // Record attendance
  const recordAttendance = async (qrCode, isArrival) => {
    console.log(`Recording attendance for QR: ${qrCode}, isArrival: ${isArrival}`);
    try {
      const { data: student, error: lookupError } = await supabase
        .from("students")
        .select("id, name, qr_code")
        .eq("qr_code", qrCode)
        .maybeSingle();

      if (lookupError || !student) {
        console.error("Student not found:", lookupError);
        return { success: false, message: "Student not found" };
      }

      console.log("Student found:", student);

      const studentId = student.id;
      const today = new Date().toISOString().split("T")[0];
      const now = new Date().toLocaleTimeString("en-GB", { hour12: false });

      const { data: existing, error: existingError } = await supabase
        .from("attendance")
        .select("*")
        .eq("student_id", studentId)
        .eq("date", today)
        .maybeSingle();

      if (existingError && existingError.code !== "PGRST116") {
        throw existingError;
      }

      console.log("Existing attendance record for today:", existing);

      if (isArrival) {
        if (existing && existing.time_in) {
          console.log("Student already checked in");
          return {
            success: false,
            message: "Student already checked in",
            student,
            record: existing,
          };
        } else {
          const { data, error } = await supabase
            .from("attendance")
            .upsert(
              { student_id: studentId, date: today, time_in: now },
              { onConflict: "student_id,date" }
            );
          if (error) throw error;

          console.log("Check-in recorded:", data);
          fetchAttendance();
          return { success: true, student, record: { ...existing, date: today, time_in: now, time_out: existing?.time_out } };
        }
      } else {
        if (!existing || !existing.time_in) {
          console.log("Cannot check out, student hasn't checked in");
          return { success: false, message: "Student has not checked in yet", student, record: existing || {} };
        }
        if (existing.time_out) {
          console.log("Student already checked out");
          return { success: false, message: "Student already checked out", student, record: existing };
        }

        const { data, error } = await supabase
          .from("attendance")
          .update({ time_out: now })
          .eq("student_id", studentId)
          .eq("date", today);
        if (error) throw error;

        console.log("Check-out recorded:", data);
        fetchAttendance();
        return { success: true, student, record: { ...existing, time_out: now } };
      }
    } catch (err) {
      console.error("Error recording attendance:", err);
      return { success: false, message: "Error recording attendance" };
    }
  };

  // Get attendance by date range
  const getAttendanceByDateRange = (startDate, endDate, classId = null) => {
    console.log(`Filtering attendance from ${startDate} to ${endDate} for classId: ${classId}`);
    let filtered = attendance.filter(record => record.date >= startDate && record.date <= endDate);

    if (classId) {
      filtered = filtered.filter(record => {
        const student = students.find(s => s.id === record.student_id);
        return student?.class_id === classId;
      });
    }

    console.log("Filtered attendance:", filtered);
    return filtered;
  };

  useEffect(() => {
    console.log("Initializing DataProvider...");
    fetchClasses();
    fetchStudents();
    fetchAttendance();
  }, []);

  const value = {
    classes,
    students,
    attendance,
    fetchClasses,
    fetchStudents,
    fetchAttendance,
    recordAttendance,
    getAttendanceByDateRange,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
