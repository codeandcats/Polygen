import * as React from 'react';
import { Button, Col, Grid, Row } from 'react-bootstrap';

export interface EditorViewProps {
}

export interface EditorViewState {
}

export class EditorView extends React.Component<EditorViewProps, EditorViewState> {
	public render() {
		return (
			<Grid>
				<Row>
					<Col xs={12}>
						Header
					</Col>
				</Row>
				<Row>
					<Col xs={12}>
						Body
					</Col>
				</Row>
				<Row>
					<Col xs={12}>
						Footer
					</Col>
				</Row>
			</Grid>
		);
	}
}
