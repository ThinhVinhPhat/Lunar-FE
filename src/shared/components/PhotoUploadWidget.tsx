import { CloudUpload, PhotoCamera, CropFree, FileUpload } from "@mui/icons-material";
import { Box, Button as MuiButton, Typography, Card, CardContent, Fade, Chip } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Cropper, ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

type Props = {
  onUpload: (file: Blob) => void;
};

export default function PhotoUploadWidget({ onUpload }: Props) {
  const [files, setFiles] = useState<object & { preview: string }[]>([]);
  const cropperRef = useRef<ReactCropperElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const onCrop = useCallback(() => {
    const cropper = cropperRef.current?.cropper;
    cropper?.getCroppedCanvas().toBlob((blob) => {
      onUpload(blob as Blob);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        gap: 4,
        minHeight: '400px'
      }}>
        {/* Step 1 - Upload Area */}
        <Box sx={{ flex: 1 }}>
          <Card 
            elevation={3}
            sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '2px solid transparent',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(200, 168, 70, 0.15)'
              }
            }}
          >
            <CardContent sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Chip 
                icon={<PhotoCamera />}
                label="Step 1 - Add Photo"
                sx={{ 
                  mb: 3,
                  backgroundColor: '#C8A846',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              />
              
              <Box
                {...getRootProps()}
                sx={{
                  flex: 1,
                  border: isDragActive ? "3px dashed #C8A846" : "3px dashed #e0e0e0",
                  borderRadius: "16px",
                  backgroundColor: isDragActive ? "rgba(200, 168, 70, 0.05)" : "#fafafa",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  minHeight: "250px",
                  '&:hover': {
                    borderColor: '#C8A846',
                    backgroundColor: 'rgba(200, 168, 70, 0.02)',
                    transform: 'scale(1.02)'
                  }
                }}
              >
                <input {...getInputProps()} />
                <CloudUpload
                  sx={{
                    fontSize: 80,
                    color: isDragActive ? '#C8A846' : '#bdbdbd',
                    mb: 2,
                    transition: 'color 0.3s ease'
                  }}
                />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: isDragActive ? '#C8A846' : '#666',
                    fontWeight: 'bold',
                    mb: 1
                  }}
                >
                  {isDragActive ? 'Drop it here!' : 'Drop image here'}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: '#999', textAlign: 'center' }}
                >
                  or click to browse files
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Step 2 - Crop Area */}
        <Box sx={{ flex: 1 }}>
          <Card 
            elevation={3}
            sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              opacity: files[0]?.preview ? 1 : 0.6,
              transition: 'all 0.3s ease'
            }}
          >
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Chip 
                icon={<CropFree />}
                label="Step 2 - Resize Image"
                sx={{ 
                  mb: 3,
                  backgroundColor: files[0]?.preview ? '#C8A846' : '#bdbdbd',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  transition: 'background-color 0.3s ease'
                }}
              />

              {files[0]?.preview ? (
                <Fade in={true} timeout={500}>
                  <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Cropper
                      src={files[0]?.preview}
                      style={{ 
                        height: 280, 
                        width: "100%",
                        borderRadius: '12px',
                        overflow: 'hidden'
                      }}
                      initialAspectRatio={1}
                      aspectRatio={1}
                      preview=".img-preview"
                      guides={false}
                      viewMode={1}
                      background={false}
                      ref={cropperRef}
                    />
                  </Box>
                </Fade>
              ) : (
                <Box 
                  sx={{ 
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed #e0e0e0',
                    borderRadius: '12px',
                    backgroundColor: '#fafafa'
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                    Upload an image to start cropping
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Step 3 - Preview & Upload */}
        <Box sx={{ flex: 1 }}>
          <Card 
            elevation={3}
            sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              opacity: files[0]?.preview ? 1 : 0.6,
              transition: 'all 0.3s ease'
            }}
          >
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Chip 
                icon={<FileUpload />}
                label="Step 3 - Preview & Upload"
                sx={{ 
                  mb: 3,
                  backgroundColor: files[0]?.preview ? '#C8A846' : '#bdbdbd',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  transition: 'background-color 0.3s ease'
                }}
              />

              {files[0]?.preview ? (
                <Fade in={true} timeout={800}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <Box
                      className="img-preview"
                      sx={{ 
                        width: 200, 
                        height: 200, 
                        overflow: "hidden",
                        borderRadius: '50%',
                        border: '4px solid #C8A846',
                        mb: 3,
                        boxShadow: '0 4px 20px rgba(200, 168, 70, 0.3)'
                      }}
                    />
                    <MuiButton
                      onClick={onCrop}
                      variant="contained"
                      size="large"
                      startIcon={<FileUpload />}
                      sx={{
                        backgroundColor: '#C8A846',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        px: 4,
                        py: 1.5,
                        borderRadius: '25px',
                        textTransform: 'none',
                        boxShadow: '0 4px 15px rgba(200, 168, 70, 0.4)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#ae923e',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(200, 168, 70, 0.5)'
                        }
                      }}
                    >
                      Upload Photo
                    </MuiButton>
                  </Box>
                </Fade>
              ) : (
                <Box 
                  sx={{ 
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed #e0e0e0',
                    borderRadius: '12px',
                    backgroundColor: '#fafafa',
                    width: '100%'
                  }}
                >
                  <Typography variant="body2" color="textSecondary" textAlign="center">
                    Crop your image to see the preview
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
