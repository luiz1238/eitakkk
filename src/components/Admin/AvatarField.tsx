import { useEffect, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import api from '../../utils/api';

type AvatarFieldProps = {
	status: { id: number; value: boolean }[];
	playerId: number;
};

const style = { maxHeight: 250 };

export default function AvatarField({ status, playerId }: AvatarFieldProps) {
	const [src, setSrc] = useState('#');
	const previousStatusID = useRef(Number.MAX_SAFE_INTEGER);

	useEffect(() => {
		let statusID = 0;
		for (const stat of status) {
			if (stat.value) {
				statusID = stat.id;
				break;
			}
		}
		if (statusID === previousStatusID.current) return;
		previousStatusID.current = statusID;
		api
			.get(`/sheet/player/avatar/${statusID}?playerID=${playerId}`)
			.then((res) => setSrc(res.data.link))
			.catch(() => setSrc('/avatar404.png'));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status]);

	return (
		<Row>
			<Col>
				<Image
					fluid
					src={src}
					alt='Avatar'
					style={style}
					onError={() => setSrc('/avatar404.png')}
				/>
			</Col>
		</Row>
	);
}
