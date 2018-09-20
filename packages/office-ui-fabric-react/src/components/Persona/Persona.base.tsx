import * as React from 'react';
import {
  BaseComponent,
  classNamesFunction,
  customizable,
  divProperties,
  getNativeProps,
  IRenderFunction,
} from '../../Utilities';
import { TooltipHost, TooltipOverflowMode, DirectionalHint } from '../../Tooltip';
import { PersonaCoin } from './PersonaCoin/PersonaCoin';
import {
  IPersonaProps,
  IPersonaSharedProps,
  IPersonaStyleProps,
  IPersonaStyles,
  PersonaPresence as PersonaPresenceEnum,
  PersonaSize,
} from './Persona.types';

const getClassNames = classNamesFunction<IPersonaStyleProps, IPersonaStyles>();

/**
 * Persona with no default styles.
 * [Use the `getStyles` API to add your own styles.](https://github.com/OfficeDev/office-ui-fabric-react/wiki/Styling)
 */
@customizable('Persona', ['theme'])
export class PersonaBase extends BaseComponent<IPersonaProps, {}> {
  public static defaultProps: IPersonaProps = {
    size: PersonaSize.size48,
    presence: PersonaPresenceEnum.none,
    imageAlt: ''
  };

  constructor(props: IPersonaProps) {
    super(props);

    this._warnDeprecations({ 'primaryText': 'text' });
  }

  public render(): JSX.Element {
    // wrapping default render behavior based on various this.props properties
    const _onRenderPrimaryText = this._onRenderText(this._getText()),
      _onRenderSecondaryText = this._onRenderText(this.props.secondaryText),
      _onRenderTertiaryText = this._onRenderText(this.props.tertiaryText),
      _onRenderOptionalText = this._onRenderText(this.props.optionalText);

    const {
      hidePersonaDetails,
      onRenderOptionalText = _onRenderOptionalText,
      onRenderPrimaryText = _onRenderPrimaryText,
      onRenderSecondaryText = _onRenderSecondaryText,
      onRenderTertiaryText = _onRenderTertiaryText,
    } = this.props;
    const size = this.props.size as PersonaSize;

    // These properties are to be explicitly passed into PersonaCoin because they are the only props directly used
    const {
      allowPhoneInitials,
      className,
      coinProps,
      showUnknownPersonaCoin,
      coinSize,
      getStyles,
      imageAlt,
      imageInitials,
      imageShouldFadeIn,
      imageShouldStartVisible,
      imageUrl,
      initialsColor,
      onPhotoLoadingStateChange,
      onRenderCoin,
      onRenderInitials,
      presence,
      showSecondaryText,
      theme,
    } = this.props;

    const personaCoinProps: IPersonaSharedProps = {
      allowPhoneInitials,
      coinProps,
      showUnknownPersonaCoin,
      coinSize,
      imageAlt,
      imageInitials,
      imageShouldFadeIn,
      imageShouldStartVisible,
      imageUrl,
      initialsColor,
      onPhotoLoadingStateChange,
      onRenderCoin,
      onRenderInitials,
      presence,
      size,
      text: this._getText()
    };

    const classNames = getClassNames(getStyles, {
      theme: theme!,
      className,
      showSecondaryText,
      presence,
      size,
    });

    const divProps = getNativeProps(this.props, divProperties);
    const personaDetails = (
      <div className={ classNames.details }>
        { this._renderElement(classNames.primaryText, onRenderPrimaryText, _onRenderPrimaryText) }
        { this._renderElement(classNames.secondaryText, onRenderSecondaryText, _onRenderSecondaryText) }
        { this._renderElement(classNames.tertiaryText, onRenderTertiaryText, _onRenderTertiaryText) }
        { this._renderElement(classNames.optionalText, onRenderOptionalText, _onRenderOptionalText) }
      </div>
    );

    return (
      <div
        { ...divProps }
        className={ classNames.root }
        style={ coinSize ? { height: coinSize, minWidth: coinSize } : undefined }
      >
        <PersonaCoin { ...personaCoinProps } />
        { (!hidePersonaDetails || (size === PersonaSize.size10 || size === PersonaSize.tiny)) && personaDetails }
      </div>
    );
  }

  /**
   * Deprecation helper for getting text.
   */
  private _getText(): string {
    return this.props.text || this.props.primaryText || '';
  }

  /**
   * Renders various types of Text (primaryText, secondaryText, etc)
   * based on the classNames passed
   * @param classNames
   * @param renderFunction
   * @param defaultRenderFunction
   */
  private _renderElement(
    classNames: string,
    renderFunction: IRenderFunction<IPersonaProps> | undefined,
    defaultRenderFunction: IRenderFunction<IPersonaProps> | undefined
  ): JSX.Element {
    return <div className={ classNames }>{ renderFunction && renderFunction(this.props, defaultRenderFunction) }</div>;
  }

  /**
   * using closure to wrap the default render behavior
   * to make it independent of the type of text passed
   * @param text
   */
  private _onRenderText(text: string | undefined): IRenderFunction<IPersonaProps> | undefined {
    // return default render behaviour for valid text or undefined
    return text
      ? (): JSX.Element => {
        // default onRender behaviour
        return (
          <TooltipHost
            content={ text }
            overflowMode={ TooltipOverflowMode.Parent }
            directionalHint={ DirectionalHint.topLeftEdge }
          >
            { text }
          </TooltipHost>
        );
      }
      : undefined;
  }
}
