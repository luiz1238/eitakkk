import type { Attribute, AttributeStatus } from '@prisma/client';
import type { AxiosRequestConfig } from 'axios';
import { useContext, useState } from 'react';
import { ErrorLogger } from '../../../contexts';
import api from '../../../utils/api';
import DataContainer from '../../DataContainer';
import AttributeEditorModal from '../../Modals/AttributeEditorModal';
import AttributeStatusEditorModal from '../../Modals/AttributeStatusEditorModal';
import EditorRow from './EditorRow';
import EditorRowWrapper from './EditorRowWrapper';

type AttributeEditorContainerProps = {
	attributes: Attribute[];
	attributeStatus: AttributeStatus[];
};

export default function AttributeEditorContainer(props: AttributeEditorContainerProps) {
	const [loading, setLoading] = useState(false);
	const [attributeModal, setAttributeModal] = useState<EditorModalData<Attribute>>({
		operation: 'create',
		show: false,
	});
	const [attributes, setAttributes] = useState(
		props.attributes.map((attr) => ({
			...attr,
			color: `#${attr.color}`,
		}))
	);
	const logError = useContext(ErrorLogger);

	function onAttributeModalSubmit({ id, name, rollable, color }: Attribute) {
		setLoading(true);
		const dbColor = color.substring(1, color.length);

		const config: AxiosRequestConfig =
			attributeModal.operation === 'create'
				? {
						method: 'PUT',
						data: { name, rollable, color: dbColor },
				  }
				: {
						method: 'POST',
						data: { id, name, rollable, color: dbColor },
				  };

		api('/sheet/attribute', config)
			.then((res) => {
				if (attributeModal.operation === 'create') {
					setAttributes([...attributes, { id: res.data.id, name, rollable, color }]);
					return;
				}
				attributes[attributes.findIndex((attr) => attr.id === id)] = {
					id,
					name,
					rollable,
					color,
				};
				setAttributes([...attributes]);
			})
			.catch(logError)
			.finally(() => setLoading(false));
	}

	function deleteAttribute(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		setLoading(true);
		api
			.delete('/sheet/attribute', { data: { id } })
			.then(() => {
				const newAttribute = [...attributes];
				const index = newAttribute.findIndex((attr) => attr.id === id);
				if (index > -1) {
					newAttribute.splice(index, 1);
					setAttributes(newAttribute);
				}
			})
			.catch(logError)
			.finally(() => setLoading(false));
	}

	return (
		<>
			<DataContainer
				xs={6}
				outline
				title='Barras de Atributo'
				addButton={{
					onAdd: () => setAttributeModal({ operation: 'create', show: true }),
					disabled: loading,
				}}>
				<EditorRowWrapper>
					{attributes.map((attr) => (
						<EditorRow
							key={attr.id}
							name={attr.name}
							onEdit={() =>
								setAttributeModal({ operation: 'edit', show: true, data: attr })
							}
							onDelete={() => deleteAttribute(attr.id)}
						/>
					))}
				</EditorRowWrapper>
			</DataContainer>
			<AttributeEditorModal
				{...attributeModal}
				onSubmit={onAttributeModalSubmit}
				onHide={() => setAttributeModal({ operation: 'create', show: false })}
				disabled={loading}
			/>
			<AttributeStatusEditorContainer
				attributeStatus={props.attributeStatus}
				attributes={attributes}
			/>
		</>
	);
}

type AttributeStatusEditorContainerProps = {
	attributes: Attribute[];
	attributeStatus: AttributeStatus[];
};

function AttributeStatusEditorContainer(props: AttributeStatusEditorContainerProps) {
	const [loading, setLoading] = useState(false);
	const [attributeStatusModal, setAttributeStatusModal] = useState<
		EditorModalData<AttributeStatus>
	>({
		operation: 'create',
		show: false,
	});
	const [attributeStatus, setAttributeStatus] = useState(props.attributeStatus);
	const logError = useContext(ErrorLogger);

	function onAttributeStatusModalSubmit({ id, name, attribute_id }: AttributeStatus) {
		setLoading(true);

		const config: AxiosRequestConfig =
			attributeStatusModal.operation === 'create'
				? {
						method: 'PUT',
						data: { name, attribute_id },
				  }
				: {
						method: 'POST',
						data: { id, name, attribute_id },
				  };

		api('/sheet/attribute/status', config)
			.then((res) => {
				if (attributeStatusModal.operation === 'create') {
					setAttributeStatus([
						...attributeStatus,
						{ id: res.data.id, name, attribute_id },
					]);
					return;
				}
				attributeStatus[attributeStatus.findIndex((attr) => attr.id === id)] = {
					id,
					name,
					attribute_id,
				};
				setAttributeStatus([...attributeStatus]);
			})
			.catch(logError)
			.finally(() => setLoading(false));
	}

	function deleteAttributeStatus(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		setLoading(true);
		api
			.delete('/sheet/attribute/status', { data: { id } })
			.then(() => {
				const newAttributeStatus = [...attributeStatus];
				const index = newAttributeStatus.findIndex((status) => status.id === id);
				if (index > -1) {
					newAttributeStatus.splice(index, 1);
					setAttributeStatus(newAttributeStatus);
				}
			})
			.catch(logError)
			.finally(() => setLoading(false));
	}

	return (
		<>
			<DataContainer
				outline
				xs={6}
				title='Status de Atributos'
				addButton={{
					onAdd: () => setAttributeStatusModal({ operation: 'create', show: true }),
					disabled: loading,
				}}>
				<EditorRowWrapper>
					{attributeStatus.map((stat) => (
						<EditorRow
							key={stat.id}
							name={stat.name}
							onEdit={() =>
								setAttributeStatusModal({ operation: 'edit', show: true, data: stat })
							}
							onDelete={() => deleteAttributeStatus(stat.id)}
						/>
					))}
				</EditorRowWrapper>
			</DataContainer>
			<AttributeStatusEditorModal
				{...attributeStatusModal}
				onSubmit={onAttributeStatusModalSubmit}
				onHide={() => setAttributeStatusModal({ operation: 'create', show: false })}
				attributes={props.attributes}
				disabled={loading}
			/>
		</>
	);
}
