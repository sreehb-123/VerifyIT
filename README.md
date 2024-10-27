# Student Security System with QR Code Tracking

A security management system that tracks student entry and exit times using QR code authentication. This system provides a secure, efficient way to monitor activity of student. This helps the student to get the perk of not waiting for long process of leave permissions granted and logging the data in books which is inefficient, makes it to record the student data and observe his/her punctuality.

## 🌟 Features

- **QR Code Authentication**: Unique QR codes for each student (each trip specifically)
- **Group trip**: The QR can be generated for a group as a whole and store the data of all the people going as a group
- **Real-time Tracking**: Monitor entry and exit times instantly
- **Activity Logging**: Comprehensive record of student movements is with both the admin and student(of their own)
- **Attendance Reports**: Generate detailed activity reports
- **User-friendly Interface**: Easy to use for both students and administrators

## 🛠️ Technologies Used

- Backend: NodeJS , Express
- Frontend: expo, react-native
- Database: MongoDB
- Languages: Typescript, Javascript
- QR Code Generation: Packages are inbuilt in expo


## ⚙️ Installation

1. Clone the repository
```bash
git clone https://github.com/sreehb-123/VerifyIT.git
cd VerifyIT
```

2. Install dependencies
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd frontend
npm install
```

3. Start the application
```bash
# Backend instructions
 cd backend
 node server.js

# Frontend instructions
 cd frontend
 npx expo start

#Enter w for web(pc) access or scan the QR for mobile access
```

## 🚀 Usage

1. **Student Registration**
   - Register new students in the system
   - Generate unique QR codes for each student

2. **Entry/Exit Scanning**
   - Scan QR code at entry points
   - System automatically records timestamp
   - View real-time status updates

## 🔒 Security & Features 

- Encrypted QR codes
- Secure database storage
- Role-based access control

## 👥 Team

- Sree Harsha
- Raghunath
- Smaran
