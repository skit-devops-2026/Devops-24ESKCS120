const defaultProjects = [
    {
        id: 1,
        name: "Job Portal",
        description: "A job portal for connecting employers with job seekers. Includes job posting, search, and application features.",
        status: "Active"
    },
    {
        id: 2,
        name: "E-Commerce Website",
        description: "Online shopping platform with product listings, cart, and checkout functionality.",
        status: "Active"
    },
    {
        id: 3,
        name: "College Management System",
        description: "System for managing student records, attendance, grades, and schedules.",
        status: "Active"
    },
    {
        id: 4,
        name: "Portfolio Website",
        description: "Personal portfolio website to showcase projects and skills.",
        status: "Completed"
    },
    {
        id: 5,
        name: "Durgesh Website",
        description: "Project management SaaS application built for college project submission.",
        status: "Active"
    }
];
const defaultTasks = [
    {
        id: 1,
        title: "Create homepage",
        description: "Design and develop the main homepage layout",
        projectId: 1,
        priority: "High",
        status: "Todo",
        assignee: "Durgesh",
        dueDate: "2026-09-15"
    },
    {
        id: 2,
        title: "Design login page",
        description: "Create UI for user login with form validation",
        projectId: 1,
        priority: "Medium",
        status: "In Progress",
        assignee: "Priya",
        dueDate: "2026-09-18"
    },
    {
        id: 3,
        title: "Create database structure",
        description: "Design and plan the database schema for all collections",
        projectId: 2,
        priority: "High",
        status: "Todo",
        assignee: "Rahul",
        dueDate: "2026-09-20"
    },
    {
        id: 4,
        title: "Build dashboard",
        description: "Create the admin dashboard with statistics and charts",
        projectId: 3,
        priority: "High",
        status: "In Progress",
        assignee: "Durgesh",
        dueDate: "2026-09-22"
    },
    {
        id: 5,
        title: "Test responsive design",
        description: "Test the website on multiple screen sizes and fix layout issues",
        projectId: 4,
        priority: "Low",
        status: "Done",
        assignee: "Priya",
        dueDate: "2026-09-10"
    },
    {
        id: 6,
        title: "Set up project repository",
        description: "Initialize Git repository and set up project structure",
        projectId: 5,
        priority: "High",
        status: "Done",
        assignee: "Durgesh",
        dueDate: "2026-09-01"
    },
    {
        id: 7,
        title: "Implement user registration",
        description: "Add signup form with validation and local storage",
        projectId: 1,
        priority: "Medium",
        status: "Todo",
        assignee: "Rahul",
        dueDate: "2026-09-25"
    },
    {
        id: 8,
        title: "Create product listing page",
        description: "Build a grid view for displaying all products with filters",
        projectId: 2,
        priority: "High",
        status: "In Progress",
        assignee: "Priya",
        dueDate: "2026-09-28"
    },
    {
        id: 9,
        title: "Build shopping cart",
        description: "Add to cart, remove, update quantity functionality",
        projectId: 2,
        priority: "Medium",
        status: "Todo",
        assignee: "Rahul",
        dueDate: "2026-10-01"
    },
    {
        id: 10,
        title: "Create CSS styles",
        description: "Design and implement all CSS for the Durgesh project",
        projectId: 5,
        priority: "High",
        status: "In Progress",
        assignee: "Durgesh",
        dueDate: "2026-09-05"
    },
    {
        id: 11,
        title: "Implement student records module",
        description: "Add, edit, delete and view student records",
        projectId: 3,
        priority: "High",
        status: "Todo",
        assignee: "Rahul",
        dueDate: "2026-10-05"
    },
    {
        id: 12,
        title: "Deploy portfolio to GitHub Pages",
        description: "Push the portfolio website to GitHub and enable Pages",
        projectId: 4,
        priority: "Low",
        status: "Done",
        assignee: "Durgesh",
        dueDate: "2026-09-08"
    }
];


const defaultTeam = [
    {
        id: 1,
        name: "Durgesh Kumar",
        email: "durgesh@Durgesh.com",
        role: "Full Stack Developer",
        initial: "DK"
    },
    {
        id: 2,
        name: "Priya Sharma",
        email: "priya@Durgesh.com",
        role: "UI/UX Designer",
        initial: "PS"
    },
    {
        id: 3,
        name: "Rahul Verma",
        email: "rahul@Durgesh.com",
        role: "Backend Developer",
        initial: "RV"
    },
    {
        id: 4,
        name: "Anita Singh",
        email: "anita@Durgesh.com",
        role: "Project Manager",
        initial: "AS"
    },
    {
        id: 5,
        name: "Vikram Patel",
        email: "vikram@Durgesh.com",
        role: "QA Tester",
        initial: "VP"
    }
];
