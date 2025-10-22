# Tawheed Educational Center Management System

A comprehensive educational management platform built with React, TypeScript, and Tailwind CSS. This system provides role-based access for administrators, teachers, SMC members, and the general public.

## 🌟 Features

### Public Features
- **Homepage**: School information, mission, and values
- **Admission Application**: Online application form for new students
- **Gallery**: Visual showcase of school facilities and activities
- **Contact & Suggestions**: Direct communication with administration via WhatsApp
- **Responsive Design**: Optimized for both desktop and mobile devices

### Admin Portal (saeed/hassan)
- **Teacher Management**: Add, remove, and manage teacher accounts
- **Attendance Monitoring**: View daily and monthly teacher attendance
- **Resource Management**: Upload and manage educational resources
- **Upload Review**: Review and grade teacher submissions
- **Announcements**: Create announcements for teachers and public
- **Timetable Management**: Upload and manage class schedules
- **Complaints Review**: Handle suggestions from teachers and public

### Teacher Portal
- **GPS-Based Sign-In**: Location-verified daily attendance
- **Resource Access**: Download educational materials
- **Lesson Plan Upload**: Submit lesson plans (Sunday/Monday only)
- **Progress Reports**: Upload student progress reports
- **Announcements**: View admin announcements
- **Timetable Access**: Download class schedules
- **Suggestion Box**: Submit feedback to administration
- **Settings**: Change password and manage profile

### SMC Portal (school)
- **Attendance Overview**: Monitor teacher attendance statistics
- **Daily Reports**: View detailed daily attendance records
- **Monthly Analytics**: Track attendance trends and patterns

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tawheed-educational-center
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 👥 User Accounts

### Admin Access
- **Username**: `saeed` | **Password**: `Archimedes`
- **Username**: `hassan` | **Password**: `Archimedes`

### SMC Access
- **Username**: `school` | **Password**: `sunnah`

### Teacher Access
- Teachers must be added by admin first
- Initial password set by admin, can be changed after first login

## 🏫 School Information

- **Digital Address**: BW-0082-2413
- **Location**: Ghana (Latitude: 7.743379, Longitude: -2.082991)
- **Contact**: 0558652422 (WhatsApp enabled)
- **Sign-in Hours**: Before 7:30 AM (on-time), After 7:30 AM (late)

## 🛠️ Technical Features

### Authentication System
- Role-based access control (Admin, Teacher, SMC, Public)
- Secure login with user validation
- Password change functionality for teachers
- First-login detection and password update prompts

### Attendance System
- GPS-based location verification
- Automatic time tracking and late detection
- Daily and monthly attendance reports
- Real-time attendance statistics

### File Management
- Upload support for PDFs and images
- File download functionality
- Resource categorization (Resources, Timetables)
- Upload status tracking and admin feedback

### Notification System
- Real-time unread count badges
- Announcement notifications
- Upload status updates
- Suggestion tracking

### Data Persistence
- Local storage for data persistence
- Real-time updates across components
- Data synchronization between contexts

## 📱 Mobile Responsiveness

- Hamburger menu navigation on mobile devices
- Touch-optimized interface elements
- Responsive grid layouts
- Mobile-first design approach

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── admin/          # Admin dashboard components
│   ├── teacher/        # Teacher dashboard components
│   ├── smc/           # SMC dashboard components
│   └── ...            # Public components
├── contexts/           # React contexts for state management
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

### Key Technologies
- **React 18**: Modern React with hooks and context
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **Vite**: Fast build tool and development server

### State Management
- **AuthContext**: User authentication and teacher management
- **DataContext**: Application data (resources, uploads, announcements)
- **AppContext**: Global app state and UI controls

## 🌐 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Hosting Requirements
- Static hosting (Netlify, Vercel, GitHub Pages)
- No server-side requirements
- HTTPS recommended for GPS functionality

## 📋 Usage Guide

### For Administrators
1. Login with admin credentials
2. Add teachers in Teacher Management
3. Upload resources and timetables
4. Review teacher submissions
5. Create announcements
6. Monitor attendance

### For Teachers
1. Login with credentials provided by admin
2. Sign in daily using GPS verification
3. Download resources and timetables
4. Upload lesson plans (Sunday/Monday only)
5. Submit progress reports
6. View announcements and submit suggestions

### For SMC Members
1. Login with SMC credentials
2. View attendance statistics
3. Monitor teacher performance
4. Generate attendance reports

### For Public Users
1. Browse school information
2. Apply for admission online
3. View school gallery
4. Contact administration via WhatsApp
5. Submit suggestions

## 🔒 Security Features

- Input validation and sanitization
- Role-based access restrictions
- GPS location verification for attendance
- Secure password handling
- XSS protection through React

## 🎨 Design Features

- Modern, clean interface design
- Consistent color scheme (green/blue theme)
- Smooth animations and transitions
- Professional typography
- Accessible UI components
- Loading states and feedback messages

## 📞 Support

For technical support or questions about the system:
- **Phone/WhatsApp**: 0558652422
- **Email**: info@tawheed-edu.com

## 📄 License

This project is developed for Tawheed Educational Center. All rights reserved.

---

**Built with ❤️ for Tawheed Educational Center**