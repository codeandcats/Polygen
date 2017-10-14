import { Button, Layout } from 'antd';
import * as React from 'react';

interface MainWindowProps {
}

interface MainWindowState {
}

export class MainWindow extends React.Component<MainWindowProps, MainWindowState> {
	public render() {
		return (
			<Layout>
				<Layout.Header>
					<Button onClick={ () => window.alert('hello') }>Click me</Button>
				</Layout.Header>
			</Layout>
		);
	}
}
