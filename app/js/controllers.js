/* App Controllers */

App.Controllers.TodoController = function () {
    var self = this;

    self.todos = [];

    self.newRow = "";

    self.addRow = function() {
        self.todos.push({
            content: self.newRow,
            done: false,
            editing: false
        });
        self.newRow = "";
    };

    self.editRow = function(todo) {
        //cancel any active editing operation
        angular.forEach(self.todos, function(value) {
            value.editing = false;
        });
        todo.editing = true;
    };

    self.finishEditing = function(todo) {
        todo.editing = false;
    };

    self.removeRow = function(todo) {
        angular.Array.remove(self.todos, todo);
    };

    var countTodos = function(done) {
        return function() {
            return angular.Array.count(self.todos, function(x) {
                return x.done === (done === "done");
            });
        }
    };

    self.remainingRows = countTodos("undone");

    self.finishedRows = countTodos("done");

    self.clearCompletedRows = function() {
        var oldTodos = self.todos;
        self.todos = [];
        angular.forEach(oldTodos, function(todo) {
            if (!todo.done) self.todos.push(todo);
        });
    };

    self.hasFinishedRows = function() {
        return self.finishedRows() > 0;
    };

    self.hasRows = function() {
        return self.todos.length > 0;
    };
	self.flag = false;
	self.checkAll = function(check) {
		self.flag = true;
		angular.forEach(self.todos, function(value) {
			value.done = true;
		});
	}

    /*
     The following code deals with hiding the hint *while* you are typing,
     showing it once you did *finish* typing (aka 500 ms since you hit the last key)
     *in case* the result is a non empty string
     */

    Rx.Observable
      .FromAngularScope(self, "newRow")
      .SelectThenThrottledSelect(function(x){ return false; }, 500, function(x){ return x.length > 0; })
      .ToOutputProperty(self, "showHitEnterHint");
};
App.Controllers.TodoController.$inject = [];