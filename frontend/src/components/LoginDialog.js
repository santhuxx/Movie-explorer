
import React, { useContext } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Typography, Slide, useTheme } from '@mui/material';
import { MovieContext } from '../context/MovieContext';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 12,
    background: `linear-gradient(135deg, ${theme.palette.background.paper}aa, ${theme.palette.background.default}bb)`,
    backdropFilter: 'blur(8px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
    maxWidth: 400,
    width: '90%',
    border: `1px solid ${theme.palette.divider}22`,
  },
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(2px)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  padding: theme.spacing(1, 2.5),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.75, 2),
    fontSize: '0.85rem',
  },
}));

const LoginDialog = () => {
  const { showLoginDialog, setShowLoginDialog } = useContext(MovieContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = () => {
    setShowLoginDialog(false);
    navigate('/login');
  };

  const handleCancel = () => {
    setShowLoginDialog(false);
  };

  return (
    <StyledDialog
      open={showLoginDialog}
      onClose={handleCancel}
      TransitionComponent={Transition}
      aria-labelledby="login-dialog-title"
    >
      <DialogTitle
        id="login-dialog-title"
        sx={{
          textAlign: 'center',
          py: 1.5,
          background: 'transparent',
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
          }}
        >
          Sign In Required
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', px: 3, py: 1.5 }}>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            lineHeight: 1.5,
          }}
        >
          Please sign in to add this movie to your favorites.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 1.5 }}>
        <StyledButton
          onClick={handleCancel}
          variant="outlined"
          sx={{
            color: theme.palette.text.primary,
            borderColor: theme.palette.divider,
            backgroundColor: 'transparent',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          Cancel
        </StyledButton>
        <StyledButton
          onClick={handleLogin}
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
            color: theme.palette.mode === 'dark' ? 'white' : theme.palette.primary.main,
            backdropFilter: 'blur(4px)',
            border: `1px solid ${theme.palette.divider}33`,
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)',
            },
          }}
        >
          Sign In
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default LoginDialog;