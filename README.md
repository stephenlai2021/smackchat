## Transition Classes

### Example
```
<transition>
  <h1>hello</h1>
</transition>
```

### on entering the page:
```
.fade-enter-from {
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}
.fade-etner-active {
  transition: opacity 2s ease;
}
```

### on leaving the page:
```
.fade-leave-from {
  opacity: 1;
}
.fade-leave-to {
  opacity: 0;
}
.fade-leave-active {
  transition: opacity 2s eas;
}
```

## Transition JavaScript Hooks

### - Can fire JavaScript code at different stages of the transition

Enter hooks:

- before-enter, enter, after-enter

Leave hooks:

- before-leave, leave, after-leave
