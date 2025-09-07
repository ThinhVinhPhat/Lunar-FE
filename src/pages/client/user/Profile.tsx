import { useEffect, useState } from "react";
import { useUpdateUser } from "@/lib/hooks/queryClient/mutator/user/user.mutator";
import { useForm } from "react-hook-form";
import UserProduct from "./UserProduct";
import DiscountPage from "./DiscountPage";
import { useGetUser } from "@/lib/hooks/queryClient/query/user/user.query";
import { useNavigate } from "react-router-dom";
import FormProfile from "@/shared/components/form/form-profile";
import { UserType } from "@/shared/types/user";
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Avatar,
  Typography,
  Chip,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Person,
  Favorite,
  LocalOffer,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const { data: user } = useGetUser();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const {
    register,
    handleSubmit,
    formState: { isDirty },
    setValue,
  } = useForm({
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phone: user?.phone,
      address: user?.address,
      company: user?.company,
      city: user?.city,
      role: user?.role,
      avatar: user?.avatar ? [user.avatar] : [],
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };


  const onSubmit = async (data: UserType) => {
    try {
      if (isDirty) {
        await updateUser(data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box className="bg-gray-50 min-h-screen pt-24 pb-8">
      <Container maxWidth="lg">
        <Paper elevation={2} className="mb-6 overflow-hidden">
          <Box className="bg-gradient-to-r from-[#C8A846] to-[#d4b851] p-6 text-white">
            <Box className="flex items-center gap-6">
              <Zoom>
                <Avatar
                  src={user?.avatar}
                  sx={{ width: 80, height: 80, border: '3px solid white' }}
                >
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Avatar>
              </Zoom>
              <Box className="flex-1">
                <Typography variant="h4" className="font-bold mb-2">
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Box className="flex flex-wrap gap-2 mb-3">
                  <Chip
                    icon={<Email className="text-white" />}
                    label={user?.email}
                    variant="outlined"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      '& .MuiChip-label': { color: 'white' }
                    }}
                    size="small"
                  />
                  {user?.phone && (
                    <Chip
                      icon={<Phone className="text-white" />}
                      label={user.phone}
                      variant="outlined"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        '& .MuiChip-label': { color: 'white' }
                      }}
                      size="small"
                    />
                  )}
                  {user?.city && (
                    <Chip
                      icon={<LocationOn className="text-white" />}
                      label={user.city}
                      variant="outlined"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        '& .MuiChip-label': { color: 'white' }
                      }}
                      size="small"
                    />
                  )}
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  {t("profile.member_since")} {new Date(user?.createdAt || Date.now()).getFullYear()}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={2}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 72,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  padding: '16px 24px',
                },
                '& .Mui-selected': {
                  color: '#C8A846 !important',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#C8A846',
                },
              }}
            >
              <Tab
                icon={<Person />}
                label={t("profile.account_information")}
                iconPosition="start"
              />
              {/* <Tab
                icon={<ShoppingBag />}
                label={t("profile.order_history")}
                iconPosition="start"
              /> */}
              <Tab
                icon={<Favorite />}
                label={t("profile.favorites_reviews")}
                iconPosition="start"
              />
              <Tab
                icon={<LocalOffer />}
                label={t("profile.discounts")}
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ padding: '24px' }}>
              <FormProfile
                user={user}
                onSubmit={onSubmit}
                handleSubmit={handleSubmit}
                register={register}
                setValue={setValue}
                formState={{ isDirty, isSubmitting: isUpdating }}
                isEditing={isEditing}
                isUpdating={isUpdating}
                setIsEditing={setIsEditing}
              />
            </Box>
          </TabPanel>

          {/* <TabPanel value={tabValue} index={1}>
            <Box sx={{ padding: '24px' }}>
              <OrderHistory />
            </Box>
          </TabPanel> */}

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ padding: '24px' }}>
              <UserProduct />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ padding: '24px' }}>
              <DiscountPage />
            </Box>
          </TabPanel>
        </Paper>

        <Card className="mt-6" elevation={1}>
          <CardContent className="text-center py-6">
            <Typography variant="body2" color="text.secondary">
              Need help? Contact us at:{" "}
              <Typography
                component="span"
                variant="body2"
                className="text-[#C8A846] font-medium"
              >
                thinhvinhp@gmail.com
              </Typography>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Profile;
