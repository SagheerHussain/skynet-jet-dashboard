import PropTypes from 'prop-types';
import { alpha, lighten, darken } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';

// project
import MainCard from 'components/MainCard';

// icons (already in your project)
import RiseOutlined from '@ant-design/icons/RiseOutlined';
import FallOutlined from '@ant-design/icons/FallOutlined';

const trendIconSX = { fontSize: '0.75rem', color: 'inherit' };

export default function AnalyticEcommerce({
  color = 'primary',
  title,
  count,
  percentage,
  isLoss = false,
  extra,
  icon // pass a MUI icon node if you want
}) {
  const isLoading = count === undefined || count === null;
  const formatCount = (v) =>
    typeof v === 'number'
      ? v.toLocaleString()
      : (v ?? '—');

  return (
    <MainCard contentSX={{ p: 2.25, overflow: 'hidden', position: 'relative' }}>
      {/* soft gradient background */}
      <Box
        sx={(theme) => {
          const pal = theme.palette[color] || theme.palette.primary;
          const main = pal.main;
          return {
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg,
              ${alpha(lighten(main, 0.25), 0.10)} 0%,
              ${alpha(main, 0.12)} 45%,
              ${alpha(darken(main, 0.25), 0.16)} 100%)`,
            '&:before': {
              content: '""',
              position: 'absolute',
              right: -90,
              top: -70,
              width: 220,
              height: 220,
              borderRadius: '50%',
              background: `radial-gradient(${alpha(main, 0.28)}, transparent 40%)`,
              filter: 'blur(12px)'
            }
          };
        }}
      />

      <Stack sx={{ gap: 1, position: 'relative' }}>
        {/* title + icon */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>

          {icon && (
            <Avatar
              variant="rounded"
              sx={(theme) => ({
                width: 36,
                height: 36,
                bgcolor: alpha((theme.palette[color]).main, 0.12),
                color: (theme.palette[color]).main,
                border: `1px solid ${alpha((theme.palette[color]).main, 0.24)}`,
                borderRadius: '50%',
                // boxShadow: `0 2px 10px ${alpha((theme.palette[color] || theme.palette.primary).main, 0.24)}`
              })}
            >
              {icon}
            </Avatar>
          )}
        </Stack>

        {/* big gradient number */}
        {isLoading ? (
          <Skeleton variant="text" sx={{ fontSize: '2rem', width: '40%' }} />
        ) : (
          <Typography
            variant="h3"
            sx={(theme) => ({
              fontWeight: 800,
              letterSpacing: '-0.5px',
              lineHeight: 1.1,
              backgroundImage: `linear-gradient(90deg,
                ${(theme.palette[color] || theme.palette.primary).main},
                ${(theme.palette[color] || theme.palette.primary).dark})`,
              color: 'transparent',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text'
            })}
          >
            {formatCount(count)}
          </Typography>
        )}

        {extra && (
          <Typography variant="caption" color="text.secondary">
            {extra}
          </Typography>
        )}
      </Stack>
    </MainCard>
  );
}

AnalyticEcommerce.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  extra: PropTypes.string,
  icon: PropTypes.node
};
