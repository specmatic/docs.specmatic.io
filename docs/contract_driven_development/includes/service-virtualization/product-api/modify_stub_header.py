import os
import sys
import yaml

def main():
    # Read the name of the file from the environment variable
    file_name = os.getenv('CONTRACT_FILE')

    if not file_name:
        print("CONTRACT_FILE environment variable not set.")
        sys.exit(1)

    try:
        with open(file_name, 'r') as file:
            # Load the YAML file
            data = yaml.safe_load(file)

            # Modify the specified header
            paths = data.get('paths', {})
            products_path = paths.get('/products', {})
            get_operation = products_path.get('get', {})
            parameters = get_operation.get('parameters', [])

            # Replace X-internal-id with X-auth-token
            for param in parameters:
                if param.get('in') == 'header' and param.get('name') == 'X-internal-id':
                    param['name'] = 'X-auth-token'
                    break

            # Print the modified data
            print(yaml.dump(data))
    except FileNotFoundError:
        print(f"File not found: {file_name}")
        sys.exit(2)
    except Exception as e:
        print(f"Error processing file: {e}")
        sys.exit(3)

if __name__ == "__main__":
    main()