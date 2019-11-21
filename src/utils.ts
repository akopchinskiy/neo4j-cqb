export class Utils {

    static stringify(obj: object) {
        let result: string;

        if (Object.keys(obj).length > 0) {
            result = obj ? JSON.stringify(obj) : '';
        }
        else {
            result = '';
        }

        return result ? result.replace(/"([$\w]+)":/g, '$1:') : '';
    }

    static parseBlock(block: string) {
        const result = /^(([\d\w]+)+)?:([\d\w]+)$/i.exec(block);

        if (result) {
            const [, , name = '', type = ''] = result;
            return { name, type };
        }
        else {
            return {
                name: '',
                type: ''
            };
        }
    }

}