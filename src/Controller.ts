/**
 * Extensible structure for attaching actions to bindings.
 * This way, the input is absolutely generic, and could even be controlled through net or AI
 */
export default class Controller<T>
{
    private readonly actionMappings : Map<string, (owner: T) => void> = new Map();
    private readonly actionBindings : Map<string, (() => boolean)[]> = new Map();

    public readonly name: String;
    private owner: T

    constructor(name: string)
    {
        this.name = name;
    }

    setOwner(owner : T) : void
    {
        this.owner = owner;
    }

    poll() : void
    {
        for(const [key, value] of this.actionBindings)
        {
            for(const condition of value)
            {
                if(condition())
                {
                    this.actionMappings.get(key)(this.owner);
                    break;
                }
            }
        }
    }

    addAction(actionName : string, onAction : (owner: T) => void) : void
    {
        this.actionMappings.set(actionName, onAction);
    }

    addBinding(targetAction : string, condition : () => boolean) : void
    {
        if(DEBUG && !this.actionMappings.has(targetAction))
            throw new Error("Action name "+targetAction+" does not exists yet");
        if(!this.actionBindings.has(targetAction))
            this.actionBindings.set(targetAction, []);
        this.actionBindings.get(targetAction).push(condition);
    }

}