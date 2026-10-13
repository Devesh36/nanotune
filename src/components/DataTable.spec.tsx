import test from 'ava';
import {render} from 'ink-testing-library';
import {DataTable} from './DataTable.js';

test('DataTable keeps an emoji intact at the preview boundary', t => {
	const instance = render(
		<DataTable
			headers={['Input', 'Output']}
			rows={[[`${'a'.repeat(26)}👩‍💻 suffix`, 'reply']]}
			columnWidths={[30, 10]}
		/>,
	);
	try {
		const frame = instance.lastFrame()!;
		t.true(frame.includes('👩‍💻'), frame);
		t.false(/\p{Surrogate}/u.test(frame), 'preview must not split a surrogate');
	} finally {
		instance.unmount();
	}
});

test('DataTable keeps wide headers and cells on one line', t => {
	const instance = render(
		<DataTable
			headers={['界'.repeat(5), 'Output']}
			rows={[['界'.repeat(8), 'reply']]}
			columnWidths={[6, 10]}
		/>,
	);
	try {
		const lines = instance.lastFrame()!.split('\n');
		t.is(lines.length, 4, 'three header lines and one data row');
		t.true(lines[1].includes('…'));
		t.true(lines[3].includes('…'));
		t.true(lines[3].includes('reply'));
	} finally {
		instance.unmount();
	}
});

test('DataTable previews multiline content on one row', t => {
	const instance = render(
		<DataTable
			headers={['Input', 'Output']}
			rows={[['line one\nline two', 'reply']]}
			columnWidths={[30, 10]}
		/>,
	);
	try {
		const frame = instance.lastFrame()!;
		t.true(frame.includes('line one line two'), frame);
		t.is(frame.split('\n').length, 4);
	} finally {
		instance.unmount();
	}
});
