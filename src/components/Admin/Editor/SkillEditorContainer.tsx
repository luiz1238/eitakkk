import type { Skill, Specialization } from '@prisma/client';
import type { AxiosRequestConfig } from 'axios';
import { useContext, useState } from 'react';
import { ErrorLogger } from '../../../contexts';
import api from '../../../utils/api';
import DataContainer from '../../DataContainer';
import SkillEditorModal from '../../Modals/SkillEditorModal';
import CreateSpecializationModal from '../../Modals/SpecializationEditorModal';
import EditorRow from './EditorRow';
import EditorRowWrapper from './EditorRowWrapper';

type SpecializationEditorContainerProps = {
	skills: Skill[];
	specializations: Specialization[];
};

export default function SpecializationEditorContainer(
	props: SpecializationEditorContainerProps
) {
	const [loading, setLoading] = useState(false);
	const [specializationModal, setSpecializationModal] = useState<
		EditorModalData<Specialization>
	>({
		show: false,
		operation: 'create',
	});
	const [specializations, setSpecializations] = useState(props.specializations);
	const logError = useContext(ErrorLogger);

	function onModalSubmit({ id, name }: Specialization) {
		setLoading(true);

		const config: AxiosRequestConfig =
			specializationModal.operation === 'create'
				? {
						method: 'PUT',
						data: { name },
				  }
				: {
						method: 'POST',
						data: { id, name },
				  };

		api('/sheet/specialization', config)
			.then((res) => {
				if (specializationModal.operation === 'create') {
					setSpecializations([...specializations, { id: res.data.id, name }]);
					return;
				}
				specializations[specializations.findIndex((cur) => cur.id === id)].name = name;
				setSpecializations([...specializations]);
			})
			.catch(logError)
			.finally(() => setLoading(false));
	}

	function deleteSpecialization(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		setLoading(true);
		api
			.delete('/sheet/specialization', { data: { id } })
			.then(() => {
				specializations.splice(
					specializations.findIndex((sp) => sp.id === id),
					1
				);
				setSpecializations([...specializations]);
			})
			.catch(logError)
			.finally(() => setLoading(false));
	}

	return (
		<>
			<DataContainer
				xs={12}
				lg={6}
				outline
				title='Especializa????es'
				addButton={{
					onAdd: () => setSpecializationModal({ operation: 'create', show: true }),
					disabled: loading,
				}}>
				<EditorRowWrapper>
					{specializations.map((spec) => (
						<EditorRow
							key={spec.id}
							name={spec.name}
							onEdit={() =>
								setSpecializationModal({ operation: 'edit', show: true, data: spec })
							}
							onDelete={() => deleteSpecialization(spec.id)}
							disabled={loading}
						/>
					))}
				</EditorRowWrapper>
			</DataContainer>
			<CreateSpecializationModal
				{...specializationModal}
				onHide={() => setSpecializationModal({ operation: 'create', show: false })}
				onSubmit={onModalSubmit}
				disabled={loading}
			/>
			<SkillEditorContainer skills={props.skills} specializations={specializations} />
		</>
	);
}

type SkillEditorContainerProps = {
	skills: Skill[];
	specializations: Specialization[];
};

// const skillEditorReducer: Reducer

function SkillEditorContainer(props: SkillEditorContainerProps) {
	// const [state, dispatch] = useReducer(, props.skills);

	const [loading, setLoading] = useState(false);
	const [skillModal, setSkillModal] = useState<EditorModalData<Skill>>({
		show: false,
		operation: 'create',
	});
	const [skills, setSkills] = useState(props.skills);
	const logError = useContext(ErrorLogger);

	function onModalSubmit({ id, name, mandatory, specialization_id, startValue }: Skill) {
		setLoading(true);

		const config: AxiosRequestConfig =
			skillModal.operation === 'create'
				? {
						method: 'PUT',
						data: { name, mandatory, specialization_id, startValue },
				  }
				: {
						method: 'POST',
						data: { id, name, mandatory, specialization_id, startValue },
				  };

		api('/sheet/skill', config)
			.then((res) => {
				if (skillModal.operation === 'create') {
					setSkills([
						...skills,
						{
							id: res.data.id,
							name,
							mandatory,
							specialization_id,
							startValue,
						},
					]);
					return;
				}
				const index = skills.findIndex((sk) => sk.id === id);
				skills[index] = {
					...skills[index],
					id,
					name,
					mandatory,
					specialization_id,
					startValue,
				};
				setSkills([...skills]);
			})
			.catch(logError)
			.finally(() => setLoading(false));
	}

	function deleteSkill(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		setLoading(true);
		api
			.delete('/sheet/skill', { data: { id } })
			.then(() => {
				const newSkill = [...skills];
				const index = newSkill.findIndex((skill) => skill.id === id);
				if (index > -1) {
					newSkill.splice(index, 1);
					setSkills(newSkill);
				}
			})
			.catch(logError)
			.finally(() => setLoading(false));
	}

	return (
		<>
			<DataContainer
				xs={12}
				lg={6}
				outline
				title='Per??cias'
				addButton={{
					onAdd: () => setSkillModal({ operation: 'create', show: true }),
					disabled: loading,
				}}>
				<EditorRowWrapper>
					{skills.map((skill) => {
						let name = skill.name;
						const spec = props.specializations.find(
							(sp) => sp.id === skill.specialization_id
						);
						if (spec) name = `${spec.name} (${name})`;
						return (
							<EditorRow
								key={skill.id}
								name={name}
								onEdit={() =>
									setSkillModal({ operation: 'edit', show: true, data: skill })
								}
								onDelete={() => deleteSkill(skill.id)}
								disabled={loading}
							/>
						);
					})}
				</EditorRowWrapper>
			</DataContainer>
			<SkillEditorModal
				{...skillModal}
				onHide={() => setSkillModal({ operation: 'create', show: false })}
				onSubmit={onModalSubmit}
				disabled={loading}
				specializations={props.specializations}
			/>
		</>
	);
}
