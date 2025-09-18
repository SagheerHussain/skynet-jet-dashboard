// material-ui
import { useTheme } from '@mui/material/styles';

import logoSrc from "/images/logo.png"

export default function LogoMain() {
  const theme = useTheme();
  return (
    <>
      <img style={{ maxWidth: "200px", marginTop: 60 }} src={logoSrc} alt="" />
    </>
  );
}
