#tutorial: http://www.blog.pythonlibrary.org/2018/05/30/loading-ui-files-in-qt-for-python/
import sys
from PySide2.QtUiTools import QUiLoader
from PySide2.QtWidgets import QApplication, QPushButton, QLineEdit, QLabel
from PySide2.QtCore import QFile, QObject

class Form(QObject):
    
    def __init__(self, ui_file, parent=None):
        super(Form, self).__init__(parent)
        ui_file = QFile(ui_file)
        ui_file.open(QFile.ReadOnly)
        
        loader = QUiLoader()
        self.window = loader.load(ui_file)
        ui_file.close()
        
        btn = self.window.findChild(QPushButton, 'calculateButton')
        btn.clicked.connect(self.calculate_sum)
        self.window.show()

    def calculate_sum(self):
        first_input = self.window.findChild(QLineEdit, "firstInput")
        second_input = self.window.findChild(QLineEdit, "secondInput")
        first_number = int(first_input.text())
        second_number = int(second_input.text())
        sum = first_number + second_number
        result_input = self.window.findChild(QLabel, "resultText")
        result_input.setText(str(sum))

if __name__ == '__main__':
    app = QApplication(sys.argv)
    form = Form('QtTest1.ui')
    sys.exit(app.exec_())