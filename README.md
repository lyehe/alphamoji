# Kids Learning Game

A simple web-based game for kids to learn the alphabet and practice typing.

## Features

- Random letter generation for typing practice
- Image association with each letter
- Alphabet display page
- Simple and intuitive user interface
- Sound effects for correct and incorrect answers

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/kids-learning-game.git
   cd kids-learning-game
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Prepare the image dataset:
   - Create an `images` folder in the project root
   - Add images for each letter of the alphabet
   - Create an `image_data.json` file with the image information

## Running the Application

1. Start the Flask development server:
   ```bash
   python app.py
   ```

2. Open a web browser and navigate to `http://localhost:5000`

## Usage

- On the home page, type the displayed letter on your keyboard.
- Images related to the current letter will be displayed.
- Navigate to the Alphabet page to see all the letters of the alphabet.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Credits

This project uses images from [Open Images Dataset](https://storage.googleapis.com/openimages/web/index.html) - a collection of free-to-use images.