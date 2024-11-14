import { forwardRef, useRef, useImperativeHandle, useState, useEffect } from 'react';
import { Box } from 'grommet';
import { FormPrevious, FormNext } from 'grommet-icons';
import IconButton from '../atom/IconButton';
import styled from 'styled-components';

const StyledCarousel = styled(Box)`
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Carousel = forwardRef(({ children }, ref) => {
  const containerRef = useRef();
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useImperativeHandle(ref, () => ({
    scrollToEnd: () => {
      if (containerRef.current) {
        setTimeout(() => {
          containerRef.current.scrollTo({
            left: containerRef.current.scrollWidth,
            behavior: 'smooth',
          });
        });
      }
    },
  }));

  const updateArrowsVisibility = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    updateArrowsVisibility();
    const container = containerRef.current;

    if (container) {
      container.addEventListener('scroll', updateArrowsVisibility);
      window.addEventListener('resize', updateArrowsVisibility);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', updateArrowsVisibility);
        window.removeEventListener('resize', updateArrowsVisibility);
      }
    };
  }, []);

  const scrollLeft = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box style={{ position: 'relative' }}>
      <StyledCarousel
        className="carousel"
        ref={containerRef}
        direction="row"
        gap="medium"
        overflow={{ horizontal: 'auto', vertical: 'hidden' }}
        pad={{ vertical: 'xsmall' }}
        style={{ scrollBehavior: 'smooth' }}
      >
        {children}
      </StyledCarousel>
      {showLeftArrow && (
        <IconButton
          icon={<FormPrevious color="dark-3" size="medium" />}
          onClick={scrollLeft}
          style={{
            position: 'absolute',
            left: '-3rem',
            top: '50%',
            transform: 'translateY(-50%)',
            border: 'none',
          }}
          secondary
          blackAndWhite
        />
      )}
      {showRightArrow && (
        <IconButton
          icon={<FormNext color="dark-3" size="medium" />}
          onClick={scrollRight}
          style={{
            position: 'absolute',
            right: '-3rem',
            top: '50%',
            transform: 'translateY(-50%)',
            border: 'none',
          }}
          secondary
          blackAndWhite
        />
      )}
    </Box>
  );
});

export default Carousel;
