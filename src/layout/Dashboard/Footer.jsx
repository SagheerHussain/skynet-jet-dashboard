// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (

    <Stack direction="row" sx={{ borderTop: "1px solid #e0e0e0", alignItems: 'center', justifyContent: 'space-between', p: '24px 16px 0px', mt: 'auto' }}>
      <Typography variant="caption">
        &copy; All rights reserved{' '}
        <Link href="https://www.masonamelia.com/" target="_blank" underline="hover">
          Mason Amelia
        </Link>
      </Typography>
    </Stack>

  );
}
