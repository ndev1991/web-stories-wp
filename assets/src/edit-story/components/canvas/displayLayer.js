/**
 * External dependencies
 */
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useStory } from '../../app';
import useCanvas from './useCanvas';
import DisplayElement from './displayElement';
import { Layer, PageArea } from './layout';

const DisplayPageArea = styled( PageArea ).attrs( { className: 'container', overflow: false } )`
	background-color: ${ ( { theme } ) => theme.colors.fg.v1 };
`;

function DisplayLayer() {
	const {
		state: { currentPage },
	} = useStory();
	const {
		state: { editingElement },
		actions: { setPageContainer },
	} = useCanvas();

	return (
		<Layer pointerEvents={ false }>
			<DisplayPageArea ref={ setPageContainer }>
				{ currentPage && currentPage.elements.map( ( { id, ...rest } ) => {
					if ( editingElement === id ) {
						return null;
					}
					return (
						<DisplayElement
							key={ id }
							element={ { id, ...rest } }
						/>
					);
				} ) }
			</DisplayPageArea>
		</Layer>
	);
}

export default DisplayLayer;