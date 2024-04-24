const catchAsync = require("../utils/catch-async");
const countEverything = catchAsync(async (req, res) => {
  const users = await User.countDocuments({});
  const students = await User.countDocuments({ role: "student" });
  const companies = await User.countDocuments({ role: "company" });
  const applications = await Applications.countDocuments({});
  const jobs = await Jobs.countDocuments({});
  const studentDetails = await Students.countDocuments({});
  const hirings = await hiredStudents.countDocuments({});
  const approvedApplications = await Applications.countDocuments({
    status: "approve",
  });
  const pendingApplications = await Applications.countDocuments({
    status: "pending",
  });
  const rejectedApplications = await Applications.countDocuments({
    status: "reject",
  });
  res.status(200).json({
    users,
    students,
    companies,
    applications,
    jobs,
    studentDetails,
    hirings,
    pendingApplications,
    approvedApplications,
    rejectedApplications,
  });
});

module.exports = { countEverything };
