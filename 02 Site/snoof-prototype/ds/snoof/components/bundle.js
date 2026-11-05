/* @ds-bundle: {"format":4,"namespace":"Snoof","components":[{"name":"Button"},{"name":"IconButton"},{"name":"SearchField"},{"name":"TextField"},{"name":"SpeciesOption"},{"name":"SpeciesSelector"},{"name":"BehaviourOption"},{"name":"BehaviourSelector"},{"name":"BehaviourLabel"},{"name":"PetCardMainPet"},{"name":"PetCardTemporaryPet"},{"name":"PlantIdentificationAction"},{"name":"PlantCard"},{"name":"BottomSheet"},{"name":"PrimaryFinding"},{"name":"EvidenceStatus"},{"name":"ContextualAttention"},{"name":"BehaviourMarker"},{"name":"ExpandableInformationCard"},{"name":"TabItem"},{"name":"BottomNavigation"},{"name":"Icon"},{"name":"AvatarPlaceholder"},{"name":"ImagePlaceholder"},{"name":"SlotPlaceholder"}]} */

(function () {
  var React = window.React;
  var h = React.createElement;
  var ICONS = {"camera":[["M4 8.5C4 7.67 4.67 7 5.5 7L8 7L9.5 5L14.5 5L16 7L18.5 7C19.33 7 20 7.67 20 8.5L20 17.5C20 18.33 19.33 19 18.5 19L5.5 19C4.67 19 4 18.33 4 17.5L4 8.5",2.0,false],["M15.5 13C15.5 14.933 13.933 16.5 12 16.5C10.067 16.5 8.5 14.933 8.5 13C8.5 11.067 10.067 9.5 12 9.5C13.933 9.5 15.5 11.067 15.5 13",2.0,false]],"check":[["M5.5 12.5L10 17L18.5 7.5",2.0,false]],"chevron-down":[["M6 9.5L12 15.5L18 9.5",2.0,false]],"chevron-right":[["M9.5 6L15.5 12L9.5 18",2.0,false]],"chevron-up":[["M6 14.5L12 8.5L18 14.5",2.0,false]],"close":[["M6 6L18 18M18 6L6 18",2.0,false]],"evidence-conflicting":[["M4 8.5L17 8.5L13.5 5M20 15.5L7 15.5L10.5 19",2.0,false]],"evidence-limited":[["M20.5 12C20.5 16.694 16.694 20.5 12 20.5C7.306 20.5 3.5 16.694 3.5 12C3.5 7.306 7.306 3.5 12 3.5C16.694 3.5 20.5 7.306 20.5 12",2.0,false],["M9.6 9.6C9.6 8.2 10.7 7.3 12 7.3C13.4 7.3 14.4 8.2 14.4 9.4C14.4 11 12 11.3 12 13.2",2.0,false],["M12 16.3L12 16.5",2.0,false]],"finding-non-toxic":[["M20.5 12C20.5 16.694 16.694 20.5 12 20.5C7.306 20.5 3.5 16.694 3.5 12C3.5 7.306 7.306 3.5 12 3.5C16.694 3.5 20.5 7.306 20.5 12",2.0,false],["M8 12.3L10.8 15L16 9.5",2.0,false]],"finding-toxic":[["M20.5 12C20.5 16.694 16.694 20.5 12 20.5C7.306 20.5 3.5 16.694 3.5 12C3.5 7.306 7.306 3.5 12 3.5C16.694 3.5 20.5 7.306 20.5 12",2.0,false],["M12 7.5L12 13",2.0,false],["M12 16.3L12 16.5",2.0,false]],"home":[["M4 11L12 4L20 11L20 19C20 19.6 19.6 20 19 20L15 20L15 14L9 14L9 20L5 20C4.4 20 4 19.6 4 19L4 11",2.0,false]],"image":[["M6.5 5L17.5 5C18.881 5 20 6.119 20 7.5L20 16.5C20 17.881 18.881 19 17.5 19L6.5 19C5.119 19 4 17.881 4 16.5L4 7.5C4 6.119 5.119 5 6.5 5",2.0,false],["M10.6 10C10.6 10.884 9.884 11.6 9 11.6C8.116 11.6 7.4 10.884 7.4 10C7.4 9.116 8.116 8.4 9 8.4C9.884 8.4 10.6 9.116 10.6 10",2.0,false],["M5 17L10 12.5L13.5 15.5L16 13L19 16",2.0,false]],"leaf":[["M5 19C5 11 11 5 19 5C19 13 13 19 5 19",2.0,false],["M5 19L12.5 11.5",2.0,false]],"paw":[["M16.2 15.5C16.2 17.433 14.32 19 12 19C9.68 19 7.8 17.433 7.8 15.5C7.8 13.567 9.68 12 12 12C14.32 12 16.2 13.567 16.2 15.5",2.0,false],["M8.2 10C8.2 10.939 7.439 11.7 6.5 11.7C5.561 11.7 4.8 10.939 4.8 10C4.8 9.061 5.561 8.3 6.5 8.3C7.439 8.3 8.2 9.061 8.2 10",2.0,false],["M11.4 6.5C11.4 7.439 10.639 8.2 9.7 8.2C8.761 8.2 8 7.439 8 6.5C8 5.561 8.761 4.8 9.7 4.8C10.639 4.8 11.4 5.561 11.4 6.5",2.0,false],["M16 6.5C16 7.439 15.239 8.2 14.3 8.2C13.361 8.2 12.6 7.439 12.6 6.5C12.6 5.561 13.361 4.8 14.3 4.8C15.239 4.8 16 5.561 16 6.5",2.0,false],["M19.2 10C19.2 10.939 18.439 11.7 17.5 11.7C16.561 11.7 15.8 10.939 15.8 10C15.8 9.061 16.561 8.3 17.5 8.3C18.439 8.3 19.2 9.061 19.2 10",2.0,false]],"search":[["M17.5 11C17.5 14.59 14.59 17.5 11 17.5C7.41 17.5 4.5 14.59 4.5 11C4.5 7.41 7.41 4.5 11 4.5C14.59 4.5 17.5 7.41 17.5 11",2.0,false],["M16 16L20 20",2.0,false]],"single-source":[["M18 12C18 15.314 15.314 18 12 18C8.686 18 6 15.314 6 12C6 8.686 8.686 6 12 6C15.314 6 18 8.686 18 12",2.0,false]],"sources-agree":[["M14.5 12C14.5 15.038 12.038 17.5 9 17.5C5.962 17.5 3.5 15.038 3.5 12C3.5 8.962 5.962 6.5 9 6.5C12.038 6.5 14.5 8.962 14.5 12",2.0,false],["M20.5 12C20.5 15.038 18.038 17.5 15 17.5C11.962 17.5 9.5 15.038 9.5 12C9.5 8.962 11.962 6.5 15 6.5C18.038 6.5 20.5 8.962 20.5 12",2.0,false]],"spinner":[["M21 12A9.000000059604645 9.000000059604645 0 1 1 11.978 3",1.9999998807907104,false]]};
  var ICON_KEYS = {"Close":"close","Search":"search","Camera":"camera","Check":"check","Chevron Right":"chevron-right","Chevron Down":"chevron-down","Chevron Up":"chevron-up","Image":"image","Spinner":"spinner","Finding Toxic":"finding-toxic","Finding Non-toxic":"finding-non-toxic","Evidence Limited":"evidence-limited","Evidence Conflicting":"evidence-conflicting","Sources Agree":"sources-agree","Single Source":"single-source","Paw":"paw","Home":"home","Leaf":"leaf"};

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

  function Icon(props) {
    var name = props.name || "Close";
    var size = props.size || 24;
    var paths = ICONS[ICON_KEYS[name] || name] || [];
    return h("svg", {
      className: cx("snoof-icon", props.className), width: size, height: size, viewBox: "0 0 24 24",
      "aria-hidden": props.title ? undefined : true, role: props.title ? "img" : undefined,
      style: { color: props.color || undefined }
    },
      props.title ? h("title", null, props.title) : null,
      paths.map(function (p, i) {
        return h("path", { key: i, d: p[0], fill: p[2] ? "currentColor" : "none", stroke: p[1] ? "currentColor" : "none",
          strokeWidth: p[1] || undefined, strokeLinecap: "round", strokeLinejoin: "round", vectorEffect: "non-scaling-stroke" });
      }));
  }

  function AvatarPlaceholder(props) {
    return h("div", { className: "snoof-avatar-placeholder", style: props.size ? { width: props.size, height: props.size } : null },
      h("span", { className: "text-caption-2" }, "3D avatar"));
  }
  function ImagePlaceholder(props) {
    return h("div", { className: "snoof-image-placeholder", style: props.size ? { width: props.size, height: props.size } : null },
      h(Icon, { name: "Image", size: 24, color: "var(--text-secondary)" }));
  }
  function SlotPlaceholder(props) {
    return h("div", { className: "snoof-slot-placeholder" },
      h("span", { className: "text-footnote" }, props.label || "Content slot — swap with sheet content"));
  }
  function media(src, fallback, cls, alt) {
    if (!src) return h(fallback);
    if (typeof src !== "string") return src;
    return h("img", { className: cls, src: src, alt: alt || "" });
  }

  function Button(props) {
    var hierarchy = props.hierarchy || "Primary";
    var state = props.state || "Default";
    if (hierarchy === "Text" && state === "Loading") state = "Default";
    var disabled = state === "Disabled";
    var loading = state === "Loading";
    return h("button", {
      type: props.type || "button",
      className: cx("snoof-button", "snoof-button--" + slug(hierarchy), "is-" + slug(state), props.fill && "snoof-button--fill", props.className),
      disabled: disabled, "aria-busy": loading || undefined, onClick: disabled || loading ? undefined : props.onClick
    },
      h("span", { className: "snoof-button__label text-body-emphasized" }, props.label != null ? props.label : "Save to my plants"),
      loading ? h("span", { className: "snoof-button__spinner" }, h(Icon, { name: "Spinner", size: 24 })) : null);
  }

  function IconButton(props) {
    var state = props.state || "Default";
    var icon = props.icon || "Close";
    return h("button", { type: "button", className: cx("snoof-icon-button", "is-" + slug(state), props.className),
      "aria-label": props.label || icon, onClick: props.onClick },
      h("span", { className: "snoof-icon-button__bg" }, h(Icon, { name: icon, size: 18 })));
  }

  function SearchField(props) {
    var state = props.state || "Default";
    var placeholder = props.placeholder != null ? props.placeholder : "Search plants by name";
    var query = props.query != null ? props.query : "Monstera";
    return h("div", { className: cx("snoof-search-field", "is-" + slug(state), props.className), role: "search" },
      h(Icon, { name: "Search", size: 20, color: "var(--text-secondary)" }),
      state === "Focused" ? h("span", { className: "snoof-caret" }) : null,
      state === "Filled"
        ? h("span", { className: "snoof-field__value text-body" }, query)
        : h("span", { className: "snoof-field__placeholder text-body" }, placeholder),
      state === "Filled" ? h("button", { type: "button", className: "snoof-search-field__clear", "aria-label": "Clear", onClick: props.onClear },
        h(Icon, { name: "Close", size: 18, color: "var(--text-secondary)" })) : null);
  }

  function TextField(props) {
    var state = props.state || "Default";
    var showHelper = props.showHelper !== false && props.showHelper !== "false";
    var isError = state === "Error";

    var editable = props.editable === true || props.editable === "true";
    var fill = props.fill === true || props.fill === "true";
    var label = props.label != null ? props.label : "Label";
    var field = editable
      ? h("span", { className: "snoof-text-field__field" },
          h("input", { type: "text", className: "snoof-field__value snoof-field__input text-body", "aria-label": props.ariaLabel || label,
            placeholder: props.placeholder != null ? props.placeholder : "", maxLength: props.maxLength != null ? Number(props.maxLength) : undefined,
            value: props.value != null ? props.value : "", onChange: props.onInput || props.onChange || function () {} }))
      : h("div", { className: "snoof-text-field__field" },
          state === "Focused" ? h("span", { className: "snoof-caret" }) : null,
          state === "Filled" || isError
            ? h("span", { className: "snoof-field__value text-body" }, props.value != null ? props.value : "Luna")
            : h("span", { className: "snoof-field__placeholder text-body" }, props.placeholder != null ? props.placeholder : "Placeholder"));
    return h(editable ? "label" : "div", { className: cx("snoof-text-field", "is-" + slug(state), editable && "is-editable", fill && "is-fill", props.className) },
      h("span", { className: "snoof-text-field__label text-subheadline-emphasized" }, label),
      field,
      isError
        ? h("span", { className: "snoof-text-field__error text-footnote", role: "alert" }, props.errorMessage != null ? props.errorMessage : "Error: enter a name to continue.")
        : (showHelper ? h("span", { className: "snoof-text-field__helper text-footnote" }, props.helper != null ? props.helper : "Helper text") : null));
  }

  function SpeciesOption(props) {
    var state = props.state || "Unselected";
    return h("button", { type: "button", role: "radio", "aria-checked": state === "Selected",
      className: cx("snoof-species-option", "is-" + slug(state), props.className), disabled: state === "Disabled", onClick: props.onClick },
      h("span", { className: "snoof-species-option__indicator" }, state === "Selected" ? h(Icon, { name: "Check", size: 16 }) : null),
      h("span", { className: "snoof-species-option__label text-headline" }, props.label != null ? props.label : "Cat"));
  }

  function SpeciesSelector(props) {
    var sel = props.selection || "None";
    return h("div", { className: cx("snoof-species-selector", props.className), role: "radiogroup", "aria-label": props.ariaLabel || "Species" },
      ["Cat", "Dog"].map(function (s) {
        return h(SpeciesOption, { key: s, label: s, state: sel === s ? "Selected" : "Unselected",
          onClick: props.onSelect ? function () { props.onSelect(s); } : undefined });
      }));
  }

  function BehaviourOption(props) {
    var control = props.control || "Checkbox";
    var state = props.state || "Unselected";
    var selected = state === "Selected";
    return h("button", { type: "button", role: control === "Radio" ? "radio" : "checkbox", "aria-checked": selected,
      className: cx("snoof-behaviour-option", "snoof-behaviour-option--" + slug(control), "is-" + slug(state), props.className),
      disabled: state === "Disabled", onClick: props.onClick },
      h("span", { className: "snoof-behaviour-option__indicator" },
        selected ? (control === "Radio" ? h("span", { className: "snoof-behaviour-option__dot" }) : h(Icon, { name: "Check", size: 16 })) : null),
      h("span", { className: "snoof-behaviour-option__label text-body" }, props.label != null ? props.label : "Bites, chews or eats plants"));
  }

  var BEHAVIOURS = ["Bites, chews or eats plants", "Sniffs or smells plants", "Touches or rubs against plants", "Lies or sleeps on plants or pots", "Drinks water from pots, saucers or vases", "Other"];
  var EXCLUSIVE = ["I don't know", "My pet doesn't usually interact with plants"];
  function BehaviourSelector(props) {
    var sel = props.selection || "None";
    return h("div", { className: cx("snoof-behaviour-selector", props.className) },
      BEHAVIOURS.map(function (b, i) {
        return h(BehaviourOption, { key: b, label: b, control: "Checkbox", state: sel === "Behaviours" && i < 2 ? "Selected" : "Unselected",
          onClick: props.onSelect ? function () { props.onSelect(b); } : undefined });
      }),
      h("span", { className: "snoof-behaviour-selector__divider text-footnote" }, "Or"),
      EXCLUSIVE.map(function (b, i) {
        return h(BehaviourOption, { key: b, label: b, control: "Radio", state: sel === "Exclusive" && i === 0 ? "Selected" : "Unselected",
          onClick: props.onSelect ? function () { props.onSelect(b); } : undefined });
      }));
  }

  function BehaviourLabel(props) {
    var state = props.state || "Derived";
    var neutral = state === "Neutral";
    return h("span", { className: cx("snoof-behaviour-label", "is-" + slug(state), props.className) },
      h(Icon, { name: "Paw", size: 14, color: neutral ? "var(--text-secondary)" : undefined }),
      h("span", { className: "text-caption-1" }, neutral ? "No habits added yet" : (props.label != null ? props.label : "Curious explorer")));
  }

  function PetCardMainPet(props) {
    return h("article", { className: cx("snoof-pet-card", props.className) },
      h("div", { className: "snoof-pet-card__identity" },
        h("div", { className: "snoof-pet-card__avatar" }, media(props.avatar, AvatarPlaceholder, "snoof-pet-card__avatar-img", "")),
        h("div", { className: "snoof-pet-card__text" },
          props.showBehaviourLabel === false ? null : h(BehaviourLabel, { label: props.behaviourLabel, state: props.behaviourLabelState }),
          h("span", { className: "snoof-pet-card__name display-title-3" }, props.petName != null ? props.petName : "Luna"),
          h("span", { className: "snoof-pet-card__species text-subheadline" }, props.species != null ? props.species : "Cat"))),
      props.showBehaviourSummary === false ? null : h("p", { className: "snoof-pet-card__summary text-callout" }, props.behaviourSummary != null ? props.behaviourSummary : "Sniffs and chews plants."),
      props.showAction === false ? null : h("div", { className: "snoof-pet-card__action" },
        h(Button, { hierarchy: "Text", label: props.actionLabel != null ? props.actionLabel : "Check for a different pet", onClick: props.onAction })));
  }

  function PetCardTemporaryPet(props) {
    return h("article", { className: cx("snoof-pet-card", "snoof-pet-card--temporary", props.className) },
      h("div", { className: "snoof-pet-card__identity" },
        h("div", { className: "snoof-pet-card__avatar" }, media(props.avatar, AvatarPlaceholder, "snoof-pet-card__avatar-img", "")),
        h("div", { className: "snoof-pet-card__text" },
          h("span", { className: "snoof-pet-card__tag text-caption-1" }, props.temporaryTag != null ? props.temporaryTag : "This check only"),
          h("span", { className: "snoof-pet-card__name display-title-3" }, props.petName != null ? props.petName : "Another cat"),
          h("span", { className: "snoof-pet-card__species text-subheadline" }, props.species != null ? props.species : "Cat"))),
      props.showBehaviourSummary === false ? null : h("p", { className: "snoof-pet-card__summary text-callout" }, props.behaviourSummary != null ? props.behaviourSummary : "Behaviours not provided"),
      props.showAction === false ? null : h("div", { className: "snoof-pet-card__action" },
        h(Button, { hierarchy: "Text", label: props.actionLabel != null ? props.actionLabel : "Back to Luna", onClick: props.onAction })));
  }

  function PlantIdentificationAction(props) {
    var method = props.method || "Search by name";
    var state = props.state || "Default";

    if (props.layout === "Tile") {
      var ink = "var(--action-secondary-text)";
      return h(props.href ? "a" : "button", { type: props.href ? undefined : "button", href: props.href, className: cx("snoof-plant-id-tile", "is-" + slug(state), props.className), onClick: props.onClick },
        h(Icon, { name: method === "Identify from photo" ? "Camera" : "Search", size: 28, color: ink }),
        h("span", { className: "snoof-plant-id-tile__row" },
          h("span", { className: "snoof-plant-id-tile__title text-headline" }, method),
          h(Icon, { name: "Chevron Right", size: 20, color: ink })));
    }
    return h("button", { type: "button", className: cx("snoof-plant-id-action", "is-" + slug(state), props.className), onClick: props.onClick },
      h("span", { className: "snoof-plant-id-action__icon" }, h(Icon, { name: method === "Identify from photo" ? "Camera" : "Search", size: 24 })),
      h("span", { className: "snoof-plant-id-action__title text-headline" }, method),
      h(Icon, { name: "Chevron Right", size: 20, color: "var(--text-secondary)" }));
  }

  function PlantCard(props) {
    var state = props.state || "Default";
    var selected = state === "Selected";
    return h("div", { className: cx("snoof-plant-card", "is-" + slug(state), props.className), role: props.onClick ? "button" : undefined,
      tabIndex: props.onClick ? 0 : undefined, "aria-pressed": props.onClick ? selected : undefined, onClick: props.onClick },
      h("div", { className: "snoof-plant-card__image" }, media(props.image, ImagePlaceholder, "snoof-plant-card__img", "")),
      h("div", { className: "snoof-plant-card__text" },
        h("span", { className: "text-headline snoof-plant-card__common" }, props.commonName != null ? props.commonName : "Swiss cheese plant"),
        props.showScientificName === false ? null : h("span", { className: "text-subheadline snoof-plant-card__scientific" }, props.scientificName != null ? props.scientificName : "Monstera deliciosa")),
      selected
        ? h("span", { className: "snoof-plant-card__selected" }, h(Icon, { name: "Check", size: 16 }))
        : (props.showChevron === false ? null : h(Icon, { name: "Chevron Right", size: 20, color: "var(--text-secondary)" })));
  }

  function BottomSheet(props) {
    var state = props.state || "Default";
    var ctaState = state === "CTA disabled" ? "Disabled" : state === "CTA loading" ? "Loading" : "Default";
    return h("section", { className: cx("snoof-bottom-sheet", props.className), role: "dialog", "aria-label": props.title || "Sheet title" },
      h("div", { className: "snoof-bottom-sheet__grabber" }, h("span", null)),
      h("div", { className: "snoof-bottom-sheet__header" },
        h("h2", { className: "snoof-bottom-sheet__title display-title-3" }, props.title != null ? props.title : "Sheet title"),
        props.showClose === false ? null : h(IconButton, { icon: "Close", label: "Close", onClick: props.onClose })),
      h("div", { className: "snoof-bottom-sheet__content" }, props.children || h(SlotPlaceholder)),

      (props.showPrimaryAction === false || props.showPrimaryAction === "false") && (props.showSecondaryAction === false || props.showSecondaryAction === "false") ? null :
      h("div", { className: "snoof-bottom-sheet__footer" },
        props.showPrimaryAction === false || props.showPrimaryAction === "false" ? null : h(Button, { hierarchy: "Primary", state: ctaState, fill: true, label: props.primaryLabel != null ? props.primaryLabel : "Continue", onClick: props.onPrimary }),
        props.showSecondaryAction === false || props.showSecondaryAction === "false" ? null : h(Button, { hierarchy: "Text", fill: true, label: props.secondaryLabel != null ? props.secondaryLabel : "Secondary action", onClick: props.onSecondary })));
  }

  function PrimaryFinding(props) {

    if (props.classification === "Insufficient evidence") {
      return h("section", { className: cx("snoof-primary-finding", "is-insufficient", props.className), role: "status" },
        h(EvidenceStatus, { state: "Limited information", label: props.insufficientLabel != null ? props.insufficientLabel : "Not enough information" }),
        h("p", { className: "text-headline snoof-primary-finding__statement" }, props.statement != null ? props.statement : "We couldn't find enough reliable information to classify this plant."),
        props.limitation === "" ? null : h("p", { className: "text-body snoof-primary-finding__limitation" }, props.limitation != null ? props.limitation : "This doesn't confirm whether the plant is toxic or non-toxic."),
        props.note ? h("span", { className: "text-footnote snoof-primary-finding__note" }, props.note) : null);
    }
    var toxic = (props.classification || "Documented toxicity") === "Documented toxicity";
    return h("section", { className: cx("snoof-primary-finding", toxic ? "is-toxic" : "is-non-toxic", props.className) },
      h("div", { className: "snoof-primary-finding__classification" },
        h(Icon, { name: toxic ? "Finding Toxic" : "Finding Non-toxic", size: 28 }),
        h("span", { className: "display-title-2 snoof-primary-finding__label" },
          toxic ? (props.toxicLabel != null ? props.toxicLabel : "Toxic to cats") : (props.nonToxicLabel != null ? props.nonToxicLabel : "Non-toxic to cats"))),
      props.showAttribution === false ? null : h("p", { className: "text-callout snoof-primary-finding__attribution" },
        props.attribution != null ? props.attribution : "Source attribution — name the sources that classify this plant."));
  }

  var EVIDENCE = {
    "Independent sources agree": { icon: "Sources Agree", label: "Independent sources agree", tone: "neutral" },
    "Sources differ": { icon: "Evidence Conflicting", label: "Sources differ", tone: "conflicting" },
    "Single source": { icon: "Single Source", label: "Single source — not independently cross-checked", tone: "neutral" },
    "Limited information": { icon: "Evidence Limited", label: "Limited information", tone: "insufficient" },
    "Sources agree, independence not verified": { icon: "Sources Agree", label: "Sources agree on the classification", tone: "neutral" }
  };
  function EvidenceStatus(props) {
    var e = EVIDENCE[props.state] || EVIDENCE["Independent sources agree"];
    return h("span", { className: cx("snoof-evidence-status", "is-" + e.tone, props.className) },
      h(Icon, { name: e.icon, size: 16 }),
      h("span", { className: "text-subheadline-emphasized" }, props.label != null ? props.label : e.label));
  }

  function ContextualAttention(props) {
    return h("aside", { className: cx("snoof-contextual-attention", props.className) },
      h("span", { className: "snoof-contextual-attention__accent", "aria-hidden": true }),
      h("div", { className: "snoof-contextual-attention__content" },
        h("div", { className: "snoof-contextual-attention__heading" },
          h(Icon, { name: "Paw", size: 20 }),
          h("span", { className: "text-headline" }, props.heading != null ? props.heading : "Relevant to Jäger")),
        h("p", { className: "text-callout" }, props.body != null ? props.body : "You told us Jäger chews plants and drinks from vases. The sources describe eating the plant and drinking vase water as ways cats can be exposed to lilies.")));
  }

  function BehaviourMarker(props) {
    var marker = props.marker || "Documented connection";
    var shape = marker === "Documented connection" ? "documented" : marker === "No documented connection found" ? "none-found" : "not-enough";
    return h("span", { className: cx("snoof-behaviour-marker", "is-" + shape, props.className) },
      h("span", { className: "snoof-behaviour-marker__shape", "aria-hidden": true },
        shape === "documented" ? h(Icon, { name: "Check", size: 14 }) : shape === "none-found" ? h("span", { className: "snoof-behaviour-marker__dash" }) : null),
      h("span", { className: "text-subheadline-emphasized" }, marker));
  }

  function ExpandableInformationCard(props) {
    var initial = (props.state || "Collapsed") === "Expanded";
    var s = React.useState(initial); var open = s[0], setOpen = s[1];
    React.useEffect(function () { setOpen(initial); }, [initial]);
    return h("section", { className: cx("snoof-expandable-card", open ? "is-expanded" : "is-collapsed", props.className) },
      h("button", { type: "button", className: "snoof-expandable-card__header", "aria-expanded": open,
        onClick: function () { setOpen(!open); if (props.onToggle) props.onToggle(!open); } },
        h("span", { className: "display-title-3" }, props.title != null ? props.title : "Section title"),
        h(Icon, { name: open ? "Chevron Up" : "Chevron Down", size: 24, color: "var(--text-accent)" })),
      h("p", { className: "text-body snoof-expandable-card__summary" }, props.summary != null ? props.summary : "Summary — essential information stays visible in both states."),
      open ? h("div", { className: "snoof-expandable-card__details" }, props.children || h(SlotPlaceholder, { label: "Content slot — swap with sheet content" })) : null);
  }

  var TAB_ICON = { Pets: "Paw", Home: "Home", Plants: "Leaf" };
  function TabItem(props) {
    var tab = props.tab || "Pets";
    var active = (props.state || "Active") === "Active";
    return h("button", { type: "button", className: cx("snoof-tab-item", active ? "is-active" : "is-inactive", props.className),
      "aria-current": active ? "page" : undefined, onClick: props.onClick },
      h("span", { className: "snoof-tab-item__indicator" }, h(Icon, { name: TAB_ICON[tab], size: 24, color: active ? undefined : "var(--text-secondary)" })),
      h("span", { className: active ? "text-subheadline-emphasized" : "text-subheadline" }, tab));
  }

  function BottomNavigation(props) {
    var activeTab = props.active || "Home";
    return h("nav", { className: cx("snoof-bottom-navigation", props.className), "aria-label": "Main" },
      ["Pets", "Home", "Plants"].map(function (t) {
        return h(TabItem, { key: t, tab: t, state: t === activeTab ? "Active" : "Inactive", onClick: props.onSelect ? function () { props.onSelect(t); } : undefined });
      }));
  }

  window.Snoof = {
    Button: Button, IconButton: IconButton, SearchField: SearchField, TextField: TextField,
    SpeciesOption: SpeciesOption, SpeciesSelector: SpeciesSelector, BehaviourOption: BehaviourOption, BehaviourSelector: BehaviourSelector,
    BehaviourLabel: BehaviourLabel, PetCardMainPet: PetCardMainPet, PetCardTemporaryPet: PetCardTemporaryPet,
    PlantIdentificationAction: PlantIdentificationAction, PlantCard: PlantCard, BottomSheet: BottomSheet,
    PrimaryFinding: PrimaryFinding, EvidenceStatus: EvidenceStatus, ContextualAttention: ContextualAttention, BehaviourMarker: BehaviourMarker,
    ExpandableInformationCard: ExpandableInformationCard, TabItem: TabItem, BottomNavigation: BottomNavigation,
    Icon: Icon, AvatarPlaceholder: AvatarPlaceholder, ImagePlaceholder: ImagePlaceholder, SlotPlaceholder: SlotPlaceholder
  };
})();
