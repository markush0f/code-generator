import * as fs from 'fs';
import * as readline from 'readline';
import { IProperty } from './types';


function generateClass(className: string, properties?: IProperty[], exportClass: boolean = false): string {
    let props: string = '';
    if (properties) {
        props = properties
            .map((property) => {
                return `${property.name}${property.optional ? '?' : ''}: ${property.type}`
            }).join(';\n\t')

    }
    const initsProps = properties?.filter((property) => {
        return property.initProp;
    });

    const constructorParams = () => {
        return initsProps?.map(property => {
            return `${property.name}${property.optional ? '?' : ''}: ${property.type}`;
        }).join(', ');
    }

    const constructorBody = () => {
        return initsProps?.map(property => {
            return `this.${property.name} = ${property.name}`
        }).join(';\n\t\t');
    }

    return `${exportClass ? 'export ' : ''}class ${className} {

  ${props}; 

  constructor(${properties ? constructorParams() : ''}) {
    ${properties ? constructorBody() : ''};
  }
}
`
}

function askQuestion(rl: readline.Interface, query: string): Promise<string> {
    return new Promise((resolve) => rl.question(query, (answer) => resolve(answer)));
}

async function selectTypes(rl: readline.Interface, types: string[]): Promise<string> {
    types.forEach((type: string, index: number) => {
        console.log(`${index + 1}. ${type}`);
    });

    let choice: string = '';
    while (!types.includes(choice)) {
        const answer = await askQuestion(rl, 'Select a type of prop by number: ');
        const index = parseInt(answer) - 1;
        if (index >= 0 && index < types.length) {
            choice = types[index];
        } else {
            console.log('Select a valid number, please try again.');
        }
    }
    return choice;
}

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const className = await askQuestion(rl, 'Enter the name of the class: ');

    const types = ['string', 'number', 'boolean', 'string[]', 'number[]', 'any'];

    const properties: IProperty[] = [];
    let addMore: boolean = true;
    while (addMore) {
        console.log(properties)
        let propName = '';
        let checkProp = false;
        while (!propName || !checkProp) {
            propName = await askQuestion(rl, 'Enter the name of the property (or press Enter to finish): ');
            checkProp = checkPropertyExist(propName, properties.map((prop) => prop.name))
            if (propName === '') {
                addMore = false;
                break;
            }
            if (!checkProp) {
                console.error(`${propName} name already exists, enter a different name.`)
            }
        }
        if (propName === '') {
            addMore = false;
        } else {
            const propType = await selectTypes(rl, types);
            const propOptional = await askQuestion(rl, `Is the property ${propName} optional? (Y/N): `);
            let optional = false;
            if (propOptional.toLocaleLowerCase() === 'y') {
                optional = true;
            }
            const initProp = await askQuestion(rl, `Init value in constructor for ${propName} (Y/N): `);
            let init = false;
            if (initProp.toLocaleLowerCase() === 'y') {
                init = true;
            }
            properties.push({
                name: propName,
                type: propType,
                optional: optional,
                initProp: init
            });
        }
    }

    const classCode = generateClass(className, properties);
    const outputPath = `./output/${className}.ts`;
    fs.mkdirSync('./output', { recursive: true });
    fs.writeFileSync(outputPath, classCode);

    console.log('\n File created!!!')
    rl.close();
}

function checkPropertyExist(property: string, properties: string[]): boolean {
    return !properties.includes(property);
}

main();

// console.log(generateClass('juan', [{ name: 'pedro', type: 'string', initProp: true }, { name: 'pedrito', type: 'number', optional: true }, { name: 'pedrito', type: 'number', optional: true, initProp: true }], true))
