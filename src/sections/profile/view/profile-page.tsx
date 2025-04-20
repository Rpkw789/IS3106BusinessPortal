import { Card, CardContent, CardHeader, Avatar, Typography, Button, Grid, TextField, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { set } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import EditIconSVG from "src/components/editIconSVG";
import Api from "src/helpers/Api";
import ChangePasswordDialog from "./changePasswordDialog";

export type ProfileViewProps = {
  profile: Profile;
  setProfileChanged: React.Dispatch<React.SetStateAction<boolean>>;
};

export type Profile = {
  _id: string; //
  name: string; //
  address: string; //
  isOperational: boolean;
  status: boolean;
  entityType: string; //
  businessType: string; //
  businessDescription: string;
  phone: string; //
  website: string; //
  email: string; //
  password: string; //
  profileImage: string; //
  created: string;
  directions: string;
  gallery: string[];
};

export function ProfileView({ profile, setProfileChanged }: ProfileViewProps) {
  const [updateData, setUpdateData] = useState({});
  const [isEditPage, setEditPage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isOperational, setIsOperational] = useState(profile.isOperational);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {

  }, []);

  const insertUpdateData = (attributeName: string, value: any) => {
    setUpdateData((prev) => ({ ...prev, [attributeName]: value }));
  }

  const handleSaveDetail = () => {
    console.log("updateData", updateData);
    Api.updateBusinessProfile(updateData, profileImage, profile._id).then((res) => {
      if (res.status === 404) {
        throw new Error("Unauthorized");
      }
      setProfileChanged((prev) => !prev);
    }).catch((error) => {
      console.error(error.message);
      alert(error.message); // Optionally show an alert to the user
    });
  }

  const handleDisableAccount = () => {
    // Disable account
  }

  const changeProfilePicture = () => {
    // Change profile picture
  }

  const handleOperationalChange = (event: SelectChangeEvent) => {
    setIsOperational(event.target.value === "Running");
    insertUpdateData("isOperational", event.target.value === "Running");
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProfileImage(file);
    // Create a URL for preview
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);

    // Here, you can also upload the image to an API

  };

  return (
    <Card style={{ margin: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ width: '100%', padding: 16, display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: 288, display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: '#121417', fontSize: 32, fontWeight: '700', lineHeight: '40px' }}>Business Profile</div>
          </div>
        </div>
        <div style={{ width: '100%', padding: 16, display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#121417', fontSize: 18, fontWeight: '700' }}>Business Profile</div>
        </div>
        <div style={{ width: '100%', padding: 16, display: 'flex' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ position: 'relative', width: 128, height: 128, backgroundColor: '#ccc', borderRadius: 12 }}>
                <img src={selectedImage || `http://localhost:3000/${profile.profileImage}`} alt="Business Avatar" style={{ width: '100%', height: '100%', borderRadius: 12, objectFit: "cover" }} />
                {isEditPage && (
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ position: 'absolute', bottom: 8, right: 8, padding: 4, minWidth: 'auto', borderRadius: '50%' }}
                    onClick={changeProfilePicture}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", cursor: "pointer" }}
                      onChange={handleImageChange}
                    />
                    <EditIconSVG />
                  </Button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 22, fontWeight: '700' }}>{profile.name}</div>
                {isEditPage ? (<></>) : (<div style={{ fontSize: 16, color: '#617A8A' }}>{profile.address}</div>)}
                {isEditPage ? (<div>
                  <TextField
                    fullWidth
                    name="businessType"
                    label="Business Type"
                    defaultValue={profile.businessType}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 3, mt: 1 }}
                    onChange={(e) => insertUpdateData("businessType", e.target.value)}
                  />
                </div>) : (<div style={{ fontSize: 16, color: '#617A8A' }}>{profile.businessType}</div>)}

              </div>
            </div>
          </div>
        </div>
        <div style={{ width: '100%', padding: 16, display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#121417', fontSize: 18, fontWeight: '700' }}>Description</div>
          {isEditPage ? (<div>
            <TextField
              multiline
              maxRows={10}
              fullWidth
              name="businessDescription"
              label=""
              defaultValue={profile.businessDescription}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 3, mt: 1 }}
              onChange={(e) => insertUpdateData("businessDescription", e.target.value)}
            />
          </div>) : (<div style={{ fontSize: 14 }}>{profile.businessDescription}</div>)}
        </div>
        <div style={{ width: '100%', padding: 16, display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#121417', fontSize: 18, fontWeight: '700' }}>Directions</div>
          {isEditPage ? (<div>
            <TextField
              multiline
              maxRows={10}
              fullWidth
              name="directions"
              label=""
              defaultValue={profile.directions}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 3, mt: 1 }}
              onChange={(e) => insertUpdateData("directions", e.target.value)}
            />
          </div>) : (<div style={{ fontSize: 14 }}>{profile.directions}</div>)}
        </div>

        <div style={{ width: '100%', padding: 16, display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#121417', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Gallery</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            {profile.gallery?.map((imgUrl, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img
                  src={`http://localhost:3000/${imgUrl}`}
                  alt={`Gallery ${index}`}
                  style={{ width: 128, height: 128, objectFit: 'cover', borderRadius: 12 }}
                />
              </div>
            ))}
            <Button onClick={() => { navigate("gallery") }} variant="contained" color="primary" style={{ padding: '12px 24px', borderRadius: 8, textTransform: 'none', maxHeight: 40 }}>
              <div style={{ fontSize: 14, fontWeight: '700' }}>{profile.gallery?.length === 0 ? "Add photos" : "View All"}</div>
            </Button>
          </div>
        </div>

        <div style={{ width: '100%', padding: 16, display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#121417', fontSize: 18, fontWeight: '700' }}>Business Details</div>
        </div>
        <div style={{ width: '100%', padding: 16, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', borderTop: '1px solid #E5E8EB', padding: 16 }}>
            <div style={{ flex: 1, paddingRight: 16 }}>
              <div style={{ fontSize: 14, color: '#617A8A' }}>Account Creation Date</div>
              <div style={{ fontSize: 14 }}>{profile.created.substring(0, 10)}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: '#617A8A' }}>Status</div>
              <div style={{ fontSize: 14 }}>{profile.status ? "Valid" : "Invalid"}</div>
            </div>
          </div>
          <div style={{ display: 'flex', borderTop: '1px solid #E5E8EB', padding: 16 }}>
            <div style={{ flex: 1, paddingRight: 16 }}>
              <div style={{ fontSize: 14, color: '#617A8A' }}>Business name</div>
              {isEditPage ? (<div>
                <TextField
                  fullWidth
                  name="name"
                  label=""
                  defaultValue={profile.name}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 3, mt: 1 }}
                  onChange={(e) => insertUpdateData("name", e.target.value)}
                />
              </div>) : (<div style={{ fontSize: 14 }}>{profile.name}</div>)}

            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: '#617A8A' }}>Business address</div>
              {isEditPage ? (<div>
                <TextField
                  fullWidth
                  name="address"
                  label=""
                  defaultValue={profile.address}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 3, mt: 1 }}
                  onChange={(e) => insertUpdateData("address", e.target.value)}
                />
              </div>) : (<div style={{ fontSize: 14 }}>{profile.address}</div>)}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E5E8EB', padding: 16 }}>
            <div style={{ flex: 1, paddingRight: 16 }}>
              <div style={{ fontSize: 14, color: '#617A8A' }}>Business phone number</div>
              {isEditPage ? (<div>
                <TextField
                  fullWidth
                  name="phone"
                  label=""
                  defaultValue={profile.phone}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 3, mt: 1 }}
                  onChange={(e) => insertUpdateData("phone", e.target.value)}
                />
              </div>) : (<div style={{ fontSize: 14 }}>{profile.phone}</div>)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: '#617A8A' }}>Website</div>
              {isEditPage ? (<div>
                <TextField
                  fullWidth
                  name="website"
                  label=""
                  defaultValue={profile.website}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 3, mt: 1 }}
                  onChange={(e) => insertUpdateData("website", e.target.value)}
                />
              </div>) : (<div style={{ fontSize: 14 }}>
                <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer">{profile.website.length > 40 ? `${profile.website.substring(0, 40)}...` : profile.website}
                </a></div>)}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E5E8EB', padding: 16 }}>
            <div style={{ flex: 1, paddingRight: 16 }}>
              <div style={{ fontSize: 14, color: '#617A8A' }}>Email</div>
              <div style={{ fontSize: 14 }}>{profile.email}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: '#617A8A' }}>Operational Status</div>
              {isEditPage ? (<div>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={isOperational ? "Running" : "Permanently Closed"}
                  label="Operational Status"
                  onChange={handleOperationalChange}
                >
                  <MenuItem value="Running">Running</MenuItem>
                  <MenuItem value="Permanently Closed">Permanently Closed</MenuItem>
                </Select>
              </div>) : (<div style={{ fontSize: 14 }}>{profile.isOperational ? "Running" : "Permanently Closed"}</div>)}
            </div>
          </div>
        </div>
        <div style={{ width: '100%', padding: 16, display: 'flex', gap: 15 }}>
          {!isEditPage ? (
            <>
              <Button onClick={() => setEditPage(true)} variant="contained" color="primary" style={{ padding: '12px 24px', borderRadius: 8, textTransform: 'none' }}>
                <div style={{ fontSize: 14, fontWeight: '700' }}>Edit Business Details</div>
              </Button>
              <Button onClick={() => setOpen(true)} variant="contained" color="info" style={{ padding: '12px 24px', borderRadius: 8, textTransform: 'none' }}>
                <div style={{ fontSize: 14, fontWeight: '700' }}>Change Password</div>
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => { setEditPage(false); handleSaveDetail() }} variant="contained" color="primary" style={{ padding: '12px 24px', borderRadius: 8, textTransform: 'none' }}>
                <div style={{ fontSize: 14, fontWeight: '700' }}>Save Details</div>
              </Button>
              <Button onClick={() => { setEditPage(false); setIsOperational(profile.isOperational); }} variant="contained" color="secondary" style={{ padding: '12px 24px', borderRadius: 8, textTransform: 'none' }}>
                <div style={{ fontSize: 14, fontWeight: '700' }}>Cancel</div>
              </Button>
            </>
          )}
        </div>
      </div>
      <ChangePasswordDialog open={open} handleClose={() => setOpen(false)} />
    </Card>

  );
}
