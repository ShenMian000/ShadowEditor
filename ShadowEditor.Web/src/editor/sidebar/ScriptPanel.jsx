import './css/ScriptPanel.css';
import { Button, Icon, Tree } from '../../ui/index';
import ScriptWindow from './window/ScriptWindow.jsx';

/**
 * 历史面板
 * @author tengge / https://github.com/tengge1
 */
class ScriptPanel extends React.Component {
    constructor(props) {
        super(props);

        this.expanded = {};

        this.state = {
            scripts: {},
            selected: null
        };

        this.handleAddScript = this.handleAddScript.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleClickIcon = this.handleClickIcon.bind(this);
        this.handleExpand = this.handleExpand.bind(this);


        this.handleEditScript = this.handleEditScript.bind(this);
        this.handleSaveScript = this.handleSaveScript.bind(this);
        this.handleRemoveScript = this.handleRemoveScript.bind(this);
        this.update = this.update.bind(this);
    }

    render() {
        const { scripts, selected } = this.state;

        const data = Object.entries(scripts || []).map(n => {
            return { // n[1]: id, name, source, type, uuid
                value: n[0],
                text: `${n[1].name}.${this.getExtension(n[1].type)}`,
                icons: [{
                    name: 'edit',
                    value: n[0],
                    icon: 'edit',
                    title: _t('Edit Script')
                }, {
                    name: 'delete',
                    value: n[0],
                    icon: 'delete',
                    title: _t('Delete Script')
                }]
            };
        });

        return <div className={'ScriptPanel'}>
            <div className={'toolbar'}>
                <Button onClick={this.handleAddScript}>{_t('New Script')}</Button>
            </div>
            <div className={'content'}>
                <Tree
                    data={data}
                    selected={selected}
                    onSelect={this.handleSelect}
                    onClickIcon={this.handleClickIcon}
                    onExpand={this.handleExpand}
                />
            </div>
            {/* <ul className={'content'}>
                </ul>{Object.values(scripts).map(n => {
                    return <li key={n.uuid}>
                        <span>{`${n.name}.${this.getExtension(n.type)}`}</span>
                        <Icon name={n.uuid}
                            icon={'edit'}
                            title={_t('Edit Script')}
                            onClick={this.handleEditScript}
                        />
                        <Icon name={n.uuid}
                            icon={'delete'}
                            title={_t('Delete Script')}
                            onClick={this.handleRemoveScript}
                        />
                    </li>;
                })}
            </ul> */}
        </div>;
    }

    getExtension(type) {
        let extension = '';

        switch (type) {
            case 'javascript':
                extension = 'js';
                break;
            case 'vertexShader':
                extension = 'glsl';
                break;
            case 'fragmentShader':
                extension = 'glsl';
                break;
            case 'json':
                extension = 'json';
                break;
        }

        return extension;
    }

    componentDidMount() {
        app.on(`scriptChanged.ScriptPanel`, this.update);
    }

    update() {
        this.setState({
            scripts: app.editor.scripts
        });
    }

    handleAddScript() {
        const window = app.createElement(ScriptWindow);
        app.addElement(window);
    }

    handleSelect(value, event) {

    }

    handleClickIcon(value, name) {
        if (name === 'edit') {
            this.handleEditScript(value);
        } else if (name === 'delete') {
            this.handleRemoveScript(value);
        }
    }

    handleExpand(value, event) {

    }

    handleEditScript(uuid) {
        var script = app.editor.scripts[uuid];
        if (script) {
            app.call(`editScript`, this, uuid, script.name, script.type, script.source, this.handleSaveScript);
        }
    }

    handleSaveScript(uuid, name, type, source) {
        app.editor.scripts[uuid] = {
            id: null,
            uuid,
            name,
            type,
            source
        };

        app.call(`scriptChanged`, this);
    }

    handleRemoveScript(uuid) {
        const script = app.editor.scripts[uuid];

        app.confirm({
            title: _t('Confirm'),
            content: `${_t('Delete')} ${script.name}.${this.getExtension(script.type)}？`,
            onOK: () => {
                delete app.editor.scripts[uuid];
                app.call('scriptChanged', this);
            }
        });
    }
}

export default ScriptPanel;