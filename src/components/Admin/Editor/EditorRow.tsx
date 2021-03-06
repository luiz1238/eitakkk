import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { BsPencil, BsTrash } from 'react-icons/bs';
import BottomTextInput from '../../BottomTextInput';
import CustomSpinner from '../../CustomSpinner';

type EditorRowProps = {
	name: string;
	onEdit: () => void;
	onDelete: () => void;
	disabled?: boolean;
};

export default function EditorRow(props: EditorRowProps) {
	return (
		<Row className='mb-2'>
			<Col xs='auto'>
				<Button
					onClick={(ev) => {
						ev.currentTarget.blur();
						props.onDelete();
					}}
					size='sm'
					variant='secondary'
					disabled={props.disabled}>
					{props.disabled ? <CustomSpinner /> : <BsTrash color='white' size='1.5rem' />}
				</Button>
			</Col>
			<Col xs='auto'>
				<Button
					onClick={(ev) => {
						ev.currentTarget.blur();
						props.onEdit();
					}}
					size='sm'
					variant='secondary'
					disabled={props.disabled}>
					{props.disabled ? <CustomSpinner /> : <BsPencil color='white' size='1.5rem' />}
				</Button>
			</Col>
			<Col>
				<BottomTextInput value={props.name} readOnly className='w-100' />
			</Col>
		</Row>
	);
}
