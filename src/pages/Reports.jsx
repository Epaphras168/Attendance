import React, { useState, useRef } from "react";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import AttendanceTable from "../components/AttendanceTable";
import { DownloadIcon, FilterIcon } from "lucide-react";
const Reports = () => {
  const {
    currentUser
  } = useAuth();
  const {
    getAttendanceByDateRange,
    getAttendanceByClass,
    classes,
    students
  } = useData();
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7); // Default to 7 days ago
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0]; // Today
  });
  const [selectedClassId, setSelectedClassId] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  // For CSV export
  const csvLink = useRef();
  const handleSearch = () => {
    let records;
    if (currentUser.role === "admin") {
      records = getAttendanceByDateRange(startDate, endDate, selectedClassId ? parseInt(selectedClassId) : null);
    } else {
      // For teachers, only show their class
      console.log("Current User Class Name: ", currentUser.class_name);
      const teacherClass = classes.find(c => c.name === currentUser.class_name);
      console.log("The Teacher's class name is: ", currentUser.class_name);
      console.log("Class ID:", teacherClass.id);
      records = getAttendanceByDateRange(startDate, endDate, teacherClass?.id);
    }
    setFilteredRecords(records);
    setHasSearched(true);
  };
  const exportToCSV = () => {
    if (filteredRecords.length === 0) return;
    // Prepare CSV data
    const csvData = filteredRecords.map(record => {
      const student = students.find(s => s.id === record.student_id);
      const className = classes.find(c => c.id === student?.class_id)?.name || "Unknown";
      console.log("Classes found: ", className);
      console.log("Student found: ", student);
      
      return {
        Date: record.date,
        Student: student?.name || "Unknown",
        Class: className,
        "Check In": record.time_in,
        "Check Out": record.time_out || "Not checked out",
        Status: record.time_out ? "Complete" : "In Progress"
      };
    });
    // Convert to CSV string
    const headers = Object.keys(csvData[0]);
    const csvContent = [headers.join(","), ...csvData.map(row => headers.map(header => `"${row[header] || ""}"`).join(","))].join("\n");
    // Create download link
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_report_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return <div>
      <h1 className="text-2xl font-semibold text-gray-900">Attendance Reports</h1>
      <p className="mt-1 text-sm text-gray-600">
        Generate and export attendance reports
      </p>
      {/* Filters */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Filter Options
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input type="date" id="start-date" name="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input type="date" id="end-date" name="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            {currentUser.role === "admin" && <div className="sm:col-span-2">
                <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                  Class (Optional)
                </label>
                <select id="class" name="class" value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                  <option value="">All Classes</option>
                  {classes.map(cls => <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>)}
                </select>
              </div>}
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSearch} variant="primary">
              <FilterIcon className="w-4 h-4 mr-1" /> Generate Report
            </Button>
          </div>
        </div>
      </div>
      {/* Results */}
      {hasSearched && <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Attendance Records
            </h2>
            {filteredRecords.length > 0 && <Button onClick={exportToCSV} variant="outline" size="sm">
                <DownloadIcon className="w-4 h-4 mr-1" /> Export to CSV
              </Button>}
          </div>
          <AttendanceTable records={filteredRecords} showClass={currentUser.role === "admin"} />
          {filteredRecords.length === 0 && <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    No Records Found
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      No attendance records found for the selected date range and filters.
                    </p>
                  </div>
                </div>
              </div>
            </div>}
        </div>}
    </div>;
};
export default Reports;