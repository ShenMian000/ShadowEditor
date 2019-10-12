import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';
import AddObjectCommand from '../../command/AddObjectCommand';

import PointLight from '../../object/light/PointLight';
import HemisphereLight from '../../object/light/HemisphereLight';
import RectAreaLight from '../../object/light/RectAreaLight';

import PointLightHelper from '../../object/light/PointLightHelper';
import HemisphereLightHelper from '../../object/light/HemisphereLightHelper';

/**
 * 光源菜单
 * @author tengge / https://github.com/tengge1
 */
class LightMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleAddAmbientLight = this.handleAddAmbientLight.bind(this);
        this.handleAddDirectionalLight = this.handleAddDirectionalLight.bind(this);
        this.handleAddPointLight = this.handleAddPointLight.bind(this);
        this.handleAddSpotLight = this.handleAddSpotLight.bind(this);
        this.handleAddHemisphereLight = this.handleAddHemisphereLight.bind(this);
        this.handleAddRectAreaLight = this.handleAddRectAreaLight.bind(this);

        this.handleAddPointLightHelper = this.handleAddPointLightHelper.bind(this);
        this.handleAddHemisphereLightHelper = this.handleAddHemisphereLightHelper.bind(this);
    }

    render() {
        const { className, style } = this.props;

        return <MenuItem title={_t('Light')}>
            <MenuItem title={_t('Ambient Light')} onClick={this.handleAddAmbientLight} />
            <MenuItem title={_t('Directional Light')} onClick={this.handleAddDirectionalLight} />
            <MenuItem title={_t('Point Light')} onClick={this.handleAddPointLight} />
            <MenuItem title={_t('Spot Light')} onClick={this.handleAddSpotLight} />
            <MenuItem title={_t('Hemisphere Light')} onClick={this.handleAddHemisphereLight} />
            <MenuItem title={_t('Rect Area Light')} onClick={this.handleAddRectAreaLight} />
            <MenuItemSeparator />
            <MenuItem title={_t('Point Light Helper')} onClick={this.handleAddPointLightHelper} />
            <MenuItem title={_t('Hemisphere Light Helper')} onClick={this.handleAddHemisphereLightHelper} />
        </MenuItem>;
    }

    // ------------------------- 环境光 ------------------------------

    handleAddAmbientLight() {
        var editor = app.editor;

        var color = 0xaaaaaa;

        var light = new THREE.AmbientLight(color);
        light.name = _t('Ambient Light');

        editor.execute(new AddObjectCommand(light));
    }

    // ------------------------- 平行光 ------------------------------

    handleAddDirectionalLight() {
        var editor = app.editor;

        var color = 0xffffff;
        var intensity = 1;

        var light = new THREE.DirectionalLight(color, intensity);
        light.name = _t('Directional Light');
        light.castShadow = true;
        light.shadow.mapSize.x = 2048;
        light.shadow.mapSize.y = 2048;
        light.shadow.camera.left = -100;
        light.shadow.camera.right = 100;
        light.shadow.camera.top = 100;
        light.shadow.camera.bottom = -100;
        light.position.set(5, 10, 7.5);

        editor.execute(new AddObjectCommand(light));
    }

    // ------------------------- 点光源 ------------------------------

    handleAddPointLight() {
        var editor = app.editor;

        var color = 0xffffff;
        var intensity = 1;
        var distance = 0;

        var light = new PointLight(color, intensity, distance);
        light.name = _t('Point Light');
        light.position.y = 5;
        light.castShadow = true;

        editor.execute(new AddObjectCommand(light));
    }

    // ------------------------- 聚光灯 ------------------------------

    handleAddSpotLight() {
        var editor = app.editor;

        var color = 0xffffff;
        var intensity = 1;
        var distance = 0;
        var angle = Math.PI * 0.1;
        var penumbra = 0;

        var light = new THREE.SpotLight(color, intensity, distance, angle, penumbra);

        light.name = _t('Spot Light');
        light.castShadow = true;

        light.position.set(5, 10, 7.5);

        editor.execute(new AddObjectCommand(light));
    }

    // ------------------------- 半球光 ------------------------------

    handleAddHemisphereLight() {
        var editor = app.editor;
        var skyColor = 0x00aaff;
        var groundColor = 0xffaa00;
        var intensity = 1;

        var light = new HemisphereLight(skyColor, groundColor, intensity);
        light.name = _t('Hemisphere Light');

        light.position.set(0, 10, 0);

        editor.execute(new AddObjectCommand(light));
    }

    // ------------------------- 矩形光 ------------------------------

    handleAddRectAreaLight() {
        var editor = app.editor;

        var color = 0xffffff;
        var intensity = 1;
        var width = 20;
        var height = 10;

        var light = new RectAreaLight(color, intensity, width, height);
        light.name = _t('Rect Area Light');

        light.position.set(0, 6, 0);

        editor.execute(new AddObjectCommand(light));
    }

    // -------------------------- 点光源帮助器 -------------------------------

    handleAddPointLightHelper() {
        let selected = app.editor.selected;

        if (!(selected instanceof THREE.PointLight)) {
            app.toast(_t('The selected object is not a point light.'));
            return;
        }

        selected.add(new PointLightHelper(selected.color));
        app.call('sceneGraphChanged', this);
    }

    // --------------------------- 半球光帮助器 --------------------------------

    handleAddHemisphereLightHelper() {
        let selected = app.editor.selected;

        if (!(selected instanceof THREE.HemisphereLight)) {
            app.toast(_t('The selected object is not a hemisphere light.'));
            return;
        }

        selected.add(new HemisphereLightHelper(selected.skyColor, selected.groundColor));
        app.call('sceneGraphChanged', this);
    }
}

export default LightMenu;