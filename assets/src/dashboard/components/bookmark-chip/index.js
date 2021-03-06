/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */

import { KEYBOARD_USER_SELECTOR, CHIP_TYPES } from '../../constants';
import { ReactComponent as BookmarkFill } from '../../icons/bookmark-fill.svg';
import { ReactComponent as BookmarkOutline } from '../../icons/bookmark-outline.svg';

const chipSize = {
  [CHIP_TYPES.STANDARD]: {
    container: '40px',
    icon: {
      height: '18px',
      width: '14px',
    },
  },
  [CHIP_TYPES.SMALL]: {
    container: '32px',
    icon: {
      height: '14px',
      width: '10px',
    },
  },
};

const ChipContainer = styled.button`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid none;
  border-radius: ${({ theme }) => theme.border.buttonRadius};
  box-shadow: ${({ theme }) => theme.chip.shadow};
  color: ${({ theme }) => theme.colors.gray500};
  cursor: pointer;
  display: flex;
  height: ${({ chipType }) => chipSize[chipType].container};
  width: ${({ chipType }) => chipSize[chipType].container};

  &:focus,
  &:active,
  &:hover {
    color: ${({ theme }) => theme.colors.gray600};
  }

  ${KEYBOARD_USER_SELECTOR} &:focus {
    border-color: ${({ theme }) => theme.colors.action};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.gray500};
    opacity: 0.5;
    pointer-events: none;
  }

  & > svg {
    margin: auto;
    height: ${({ chipType }) => chipSize[chipType].icon.height};
    width: ${({ chipType }) => chipSize[chipType].icon.width};
  }
`;

ChipContainer.propTypes = {
  chipType: PropTypes.oneOf(Object.values(CHIP_TYPES)),
};

const BookmarkChip = ({
  isBookmarked,
  chipType = CHIP_TYPES.STANDARD,
  ...rest
}) => {
  return (
    <ChipContainer isBookmarked={isBookmarked} chipType={chipType} {...rest}>
      {isBookmarked ? (
        <BookmarkFill data-testid={'is-bookmarked'} />
      ) : (
        <BookmarkOutline data-testid={'not-bookmarked'} />
      )}
    </ChipContainer>
  );
};

BookmarkChip.propTypes = {
  isBookmarked: PropTypes.bool,
  chipType: PropTypes.oneOf(Object.values(CHIP_TYPES)),
};

export default BookmarkChip;
