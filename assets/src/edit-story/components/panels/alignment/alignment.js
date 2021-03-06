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
import { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import WithTooltip from '../../tooltip';
import { useConfig } from '../../../app';
import { useKeyDownEffect } from '../../keyboard';
import { ReactComponent as AlignBottom } from '../../../icons/align_bottom.svg';
import { ReactComponent as AlignTop } from '../../../icons/align_top.svg';
import { ReactComponent as AlignCenter } from '../../../icons/align_center.svg';
import { ReactComponent as AlignMiddle } from '../../../icons/align_middle.svg';
import { ReactComponent as AlignLeft } from '../../../icons/align_left.svg';
import { ReactComponent as AlignRight } from '../../../icons/align_right.svg';
import { ReactComponent as HorizontalDistribute } from '../../../icons/horizontal_distribute.svg';
import { ReactComponent as VerticalDistribute } from '../../../icons/vertical_distribute.svg';
import getCommonValue from '../utils/getCommonValue';
import getBoundRect, {
  calcRotatedObjectPositionAndSize,
} from '../utils/getBoundRect';
import useAlignment from './useAlignment';

const ElementRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.bg.v9};
`;

const IconButton = styled.button`
  display: flex;
  width: 28px;
  height: 28px;
  justify-content: center;
  align-items: center;
  background-color: unset;
  cursor: pointer;
  padding: 0;
  border: 0;
  border-radius: 4px;

  &:hover {
    background-color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.1)};
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.2;
  }

  svg {
    color: ${({ theme }) => theme.colors.mg.v2};
    width: 28px;
    height: 28px;
  }
`;

const SeparateBorder = styled.div`
  border-left: 1px dashed ${({ theme }) => rgba(theme.colors.bg.v0, 0.3)};
  height: 12px;
  margin-left: 4px;
  margin-right: 4px;
`;

const alignmentButtonIds = [
  'distributeHorizontally',
  'distributeVertically',
  'alignLeft',
  'alignCenter',
  'alignRight',
  'alignTop',
  'alignMiddle',
  'alignBottom',
];

function ElementAlignmentPanel({ selectedElements, pushUpdate }) {
  const { isRTL } = useConfig();
  const boundRect = getBoundRect(selectedElements);
  const isFill = getCommonValue(selectedElements, 'isFill');

  const updatedSelectedElementsWithFrame = useMemo(
    () =>
      selectedElements.map((item) => {
        const { id, x, y, width, height, rotationAngle } = item;
        let frameX = x;
        let frameY = y;
        let frameWidth = width;
        let frameHeight = height;
        if (rotationAngle) {
          const elementFrame = calcRotatedObjectPositionAndSize(
            rotationAngle,
            x,
            y,
            width,
            height
          );
          frameX = elementFrame.x;
          frameY = elementFrame.y;
          frameWidth = elementFrame.width;
          frameHeight = elementFrame.height;
        }
        return {
          id,
          x,
          y,
          width,
          height,
          frameX,
          frameY,
          frameWidth,
          frameHeight,
        };
      }),
    [selectedElements]
  );

  const {
    setUpdatedSelectedElementsWithFrame,
    handleAlign,
    handleAlignCenter,
    handleAlignMiddle,
    handleHorizontalDistribution,
    handleVerticalDistribution,
  } = useAlignment();
  useEffect(
    () => setUpdatedSelectedElementsWithFrame(updatedSelectedElementsWithFrame),
    [updatedSelectedElementsWithFrame, setUpdatedSelectedElementsWithFrame]
  );

  const isAlignEnabled = !isFill && selectedElements.length > 1;
  const isDistributionEnabled = !isFill && selectedElements.length > 2;

  const ref = useRef();
  const [currentButton, setCurrentButton] = useState(null);

  const handleNavigation = useCallback(
    (direction) => () => {
      const currentIndex = alignmentButtonIds.findIndex(
        (id) => id === currentButton
      );
      const nextButtonId = alignmentButtonIds[currentIndex + direction];
      if (!nextButtonId) {
        return;
      }
      setCurrentButton(nextButtonId);
      ref.current.querySelector(`#${nextButtonId}`).focus();
    },
    [currentButton, setCurrentButton]
  );

  const backwardDirection = isRTL ? 1 : -1;
  const forwardDirection = isRTL ? -1 : 1;

  useKeyDownEffect(ref, 'left', handleNavigation(backwardDirection), [
    handleNavigation,
  ]);
  useKeyDownEffect(ref, 'right', handleNavigation(forwardDirection), [
    handleNavigation,
  ]);

  useKeyDownEffect(
    ref,
    { key: 'mod+{', shift: true },
    () => handleAlign('left'),
    []
  );

  useKeyDownEffect(ref, { key: 'mod+h', shift: true }, handleAlignCenter, []);

  useKeyDownEffect(
    ref,
    { key: 'mod+}', shift: true },
    () => handleAlign('right'),
    []
  );

  return (
    <ElementRow ref={ref}>
      <WithTooltip title={__('Distribute horizontally', 'web-stories')}>
        <IconButton
          disabled={!isDistributionEnabled}
          onClick={() => handleHorizontalDistribution(boundRect, pushUpdate)}
          aria-label={__('Horizontal Distribution', 'web-stories')}
          id={alignmentButtonIds[0]}
          onFocus={() => setCurrentButton(alignmentButtonIds[0])}
        >
          <HorizontalDistribute />
        </IconButton>
      </WithTooltip>
      <WithTooltip title={__('Distribute vertically', 'web-stories')}>
        <IconButton
          disabled={!isDistributionEnabled}
          onClick={() => handleVerticalDistribution(boundRect, pushUpdate)}
          aria-label={__('Vertical Distribution', 'web-stories')}
          id={alignmentButtonIds[1]}
          onFocus={() => setCurrentButton(alignmentButtonIds[1])}
        >
          <VerticalDistribute />
        </IconButton>
      </WithTooltip>
      <SeparateBorder />
      <WithTooltip title={__('Align left', 'web-stories')} shortcut="mod+{">
        <IconButton
          disabled={!isAlignEnabled}
          onClick={() => handleAlign('left', boundRect, pushUpdate)}
          aria-label={__('Justify Left', 'web-stories')}
          id={alignmentButtonIds[2]}
          onFocus={() => setCurrentButton(alignmentButtonIds[2])}
        >
          <AlignLeft />
        </IconButton>
      </WithTooltip>
      <WithTooltip title={__('Align center', 'web-stories')} shortcut="mod+H">
        <IconButton
          disabled={!isAlignEnabled}
          onClick={() => handleAlignCenter(boundRect, pushUpdate)}
          aria-label={__('Justify Center', 'web-stories')}
          id={alignmentButtonIds[3]}
          onFocus={() => setCurrentButton(alignmentButtonIds[3])}
        >
          <AlignCenter />
        </IconButton>
      </WithTooltip>
      <WithTooltip title={__('Align right', 'web-stories')} shortcut="mod+}">
        <IconButton
          disabled={!isAlignEnabled}
          onClick={() => handleAlign('right', boundRect, pushUpdate)}
          aria-label={__('Justify Right', 'web-stories')}
          id={alignmentButtonIds[4]}
          onFocus={() => setCurrentButton(alignmentButtonIds[4])}
        >
          <AlignRight />
        </IconButton>
      </WithTooltip>
      <WithTooltip title={__('Align top', 'web-stories')}>
        <IconButton
          disabled={!isAlignEnabled}
          onClick={() => handleAlign('top', boundRect, pushUpdate)}
          aria-label={__('Justify Top', 'web-stories')}
          id={alignmentButtonIds[5]}
          onFocus={() => setCurrentButton(alignmentButtonIds[5])}
        >
          <AlignTop />
        </IconButton>
      </WithTooltip>
      <WithTooltip title={__('Align vertical center', 'web-stories')}>
        <IconButton
          disabled={!isAlignEnabled}
          onClick={() => handleAlignMiddle(boundRect, pushUpdate)}
          aria-label={__('Justify Middle', 'web-stories')}
          id={alignmentButtonIds[6]}
          onFocus={() => setCurrentButton(alignmentButtonIds[6])}
        >
          <AlignMiddle />
        </IconButton>
      </WithTooltip>
      <WithTooltip title={__('Align bottom', 'web-stories')}>
        <IconButton
          disabled={!isAlignEnabled}
          onClick={() => handleAlign('bottom', boundRect, pushUpdate)}
          aria-label={__('Justify Bottom', 'web-stories')}
          id={alignmentButtonIds[7]}
          onFocus={() => setCurrentButton(alignmentButtonIds[7])}
        >
          <AlignBottom />
        </IconButton>
      </WithTooltip>
    </ElementRow>
  );
}

ElementAlignmentPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default ElementAlignmentPanel;
