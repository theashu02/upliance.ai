import React, { useState } from 'react';
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Alert,
  Chip,
  Avatar,
  IconButton,
  Box,
  Paper,
  Divider,
} from '@mui/material';

// Mock Material Icons since we can't import them directly
const FavoriteIcon = () => <span>❤️</span>;
const ShareIcon = () => <span>📤</span>;
const SettingsIcon = () => <span>⚙️</span>;

interface User {
  name: string;
  email: string;
  role: string;
}

const SimpleMUITest: React.FC = () => {
  const [user, setUser] = useState<User>({
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Developer',
  });
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(true);

  const handleInputChange = (field: keyof User) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUser({ ...user, [field]: event.target.value });
  };

  const handleSave = () => {
    alert(`Saved: ${JSON.stringify(user, null, 2)}`);
  };

  return (
    <div className={`min-h-screen p-6 transition-colors ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <Paper className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h4" className="font-bold text-gray-800">
                MUI Test Component
              </Typography>
              <Typography variant="body2" className="text-gray-600 mt-1">
                Testing Material-UI components with Tailwind CSS
              </Typography>
            </div>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  color="primary"
                />
              }
              label="Dark Mode"
            />
          </div>
        </Paper>

        {/* Alert */}
        {showAlert && (
          <Alert 
            severity="info" 
            onClose={() => setShowAlert(false)}
            className="mb-4"
          >
            This is a test component to verify MUI integration works properly!
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Form Card */}
          <Card className="h-fit">
            <CardContent className="p-6">
              <Typography variant="h6" className="mb-4 font-semibold">
                User Information
              </Typography>
              
              <div className="space-y-4">
                <TextField
                  fullWidth
                  label="Full Name"
                  value={user.name}
                  onChange={handleInputChange('name')}
                  variant="outlined"
                />
                
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={user.email}
                  onChange={handleInputChange('email')}
                  variant="outlined"
                />
                
                <TextField
                  fullWidth
                  label="Role"
                  value={user.role}
                  onChange={handleInputChange('role')}
                  variant="outlined"
                />
                
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    className="flex-1"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setUser({ name: '', email: '', role: '' })}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Display Card */}
          <Card className="h-fit">
            <CardContent className="p-6">
              <Typography variant="h6" className="mb-4 font-semibold">
                User Profile
              </Typography>
              
              <div className="space-y-4">
                {/* Avatar and Info */}
                <div className="flex items-center space-x-4">
                  <Avatar 
                    className="w-16 h-16 bg-blue-500 text-xl"
                    sx={{ width: 64, height: 64 }}
                  >
                    {user.name.charAt(0) || 'U'}
                  </Avatar>
                  <div>
                    <Typography variant="h6" className="font-semibold">
                      {user.name || 'No Name'}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {user.email || 'No Email'}
                    </Typography>
                  </div>
                </div>
                
                <Divider />
                
                {/* Role Chip */}
                <div>
                  <Typography variant="body2" className="mb-2 text-gray-600">
                    Role:
                  </Typography>
                  <Chip 
                    label={user.role || 'No Role'} 
                    color="primary" 
                    variant="filled"
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <IconButton color="error">
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton color="primary">
                    <ShareIcon />
                  </IconButton>
                  <IconButton>
                    <SettingsIcon />
                  </IconButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Button Showcase */}
        <Paper className="p-6">
          <Typography variant="h6" className="mb-4 font-semibold">
            Button Variants
          </Typography>
          <div className="flex flex-wrap gap-3">
            <Button variant="contained" color="primary">
              Contained
            </Button>
            <Button variant="outlined" color="primary">
              Outlined
            </Button>
            <Button variant="text" color="primary">
              Text
            </Button>
            <Button variant="contained" color="secondary">
              Secondary
            </Button>
            <Button variant="contained" color="error">
              Error
            </Button>
            <Button variant="contained" color="success">
              Success
            </Button>
            <Button variant="contained" color="warning">
              Warning
            </Button>
            <Button variant="contained" disabled>
              Disabled
            </Button>
          </div>
        </Paper>

        {/* Color Chips */}
        <Paper className="p-6">
          <Typography variant="h6" className="mb-4 font-semibold">
            Chip Colors
          </Typography>
          <div className="flex flex-wrap gap-2">
            <Chip label="Default" />
            <Chip label="Primary" color="primary" />
            <Chip label="Secondary" color="secondary" />
            <Chip label="Success" color="success" />
            <Chip label="Error" color="error" />
            <Chip label="Warning" color="warning" />
            <Chip label="Info" color="info" />
          </div>
        </Paper>

        {/* Typography Examples */}
        <Paper className="p-6">
          <Typography variant="h6" className="mb-4 font-semibold">
            Typography Variants
          </Typography>
          <div className="space-y-2">
            <Typography variant="h1">Heading 1</Typography>
            <Typography variant="h2">Heading 2</Typography>
            <Typography variant="h3">Heading 3</Typography>
            <Typography variant="h4">Heading 4</Typography>
            <Typography variant="h5">Heading 5</Typography>
            <Typography variant="h6">Heading 6</Typography>
            <Typography variant="subtitle1">Subtitle 1</Typography>
            <Typography variant="subtitle2">Subtitle 2</Typography>
            <Typography variant="body1">
              Body 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Typography>
            <Typography variant="body2">
              Body 2: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Typography>
            <Typography variant="caption">Caption text</Typography>
            <Typography variant="overline">OVERLINE TEXT</Typography>
          </div>
        </Paper>

        {/* Tailwind Integration Test */}
        <Paper className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <Typography variant="h6" className="mb-4 font-semibold text-indigo-800">
            MUI + Tailwind Integration
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Typography variant="body1" className="text-blue-600 font-medium">
                MUI Components
              </Typography>
              <Typography variant="body2" className="text-gray-600 mt-1">
                Using Material-UI components
              </Typography>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Typography variant="body1" className="text-green-600 font-medium">
                Tailwind Classes
              </Typography>
              <Typography variant="body2" className="text-gray-600 mt-1">
                For layout and spacing
              </Typography>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Typography variant="body1" className="text-purple-600 font-medium">
                TypeScript
              </Typography>
              <Typography variant="body2" className="text-gray-600 mt-1">
                Type-safe development
              </Typography>
            </div>
          </div>
        </Paper>

        {/* Status Display */}
        <Box className="text-center py-4">
          <Typography variant="body2" className="text-gray-600">
            ✅ MUI components are working correctly!
          </Typography>
          <Typography variant="caption" className="text-gray-500">
            All components rendered successfully with TypeScript and Tailwind integration
          </Typography>
        </Box>
      </div>
    </div>
  );
};

export default SimpleMUITest;