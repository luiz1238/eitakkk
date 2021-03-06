import type { Attribute } from '@prisma/client';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import SheetModal from './SheetModal';

const initialState: Attribute = {
	id: 0,
	name: '',
	rollable: false,
	color: '#ff0000',
};

export default function AttributeEditorModal(props: EditorModalProps<Attribute>) {
	const [attribute, setAttribute] = useState(initialState);

	useEffect(() => {
		if (!props.data) return;
		setAttribute(props.data);
	}, [props.data]);

	function hide() {
		setAttribute(initialState);
		props.onHide();
	}

	return (
		<SheetModal
			animation={false}
			title={props.operation === 'create' ? 'Criar Atributo' : 'Editar Atributo'}
			show={props.show}
			onHide={hide}
			applyButton={{
				name: props.operation === 'create' ? 'Criar' : 'Editar',
				onApply: () => {
					props.onSubmit(attribute);
					hide();
				},
				disabled: props.disabled,
			}}>
			<Container fluid>
				<FormGroup className='mb-3' controlId='createAttributeName'>
					<FormLabel>Nome</FormLabel>
					<FormControl
						autoFocus
						className='theme-element'
						value={attribute.name}
						onChange={(ev) =>
							setAttribute((attr) => ({ ...attr, name: ev.target.value }))
						}
					/>
				</FormGroup>
				<FormGroup className='mb-3' controlId='createAttributeColor'>
					<FormLabel>Cor</FormLabel>
					<FormControl
						type='color'
						value={attribute.color}
						onChange={(ev) =>
							setAttribute((attr) => ({ ...attr, color: ev.target.value }))
						}
						className='theme-element'
					/>
				</FormGroup>
				<FormCheck
					inline
					checked={attribute.rollable}
					onChange={(ev) =>
						setAttribute((attr) => ({ ...attr, rollable: ev.target.checked }))
					}
					id='createAttributeRollable'
					label='Testável?'
				/>
			</Container>
		</SheetModal>
	);
}
